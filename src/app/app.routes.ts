import { Routes } from '@angular/router';
import { CharacterList } from './components/character-list/character-list.component';
import { CharacterDetails } from './components/character-details/character-details.component';
import { NotFound } from './shared/components/not-found/not-found.component';
import { Layout } from './layout/layout';
import { publicGuard } from './core/guards/public.guard';
import { authGuard } from './core/guards/auth.guard';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'auth',
        canActivate: [publicGuard],
        children: [
          { path: 'login', component: Login },
          { path: 'register', component: Register },
          { path: '', redirectTo: 'login', pathMatch: 'full' },
        ],
      },
      {
        path: 'characters',
        canActivate: [authGuard],
        children: [
          { path: '', component: CharacterList },
          { path: ':id', component: CharacterDetails },
        ],
      },
      { path: '', redirectTo: 'characters', pathMatch: 'full' },
    ],
  },

  { path: '404', component: NotFound },
  { path: '**', redirectTo: '404' },
];
