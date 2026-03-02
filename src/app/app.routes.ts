import { Routes } from '@angular/router';
import { CharacterList } from './components/character-list/character-list.component';
import { CharacterDetails } from './components/character-details/character-details.component';
import { NotFound } from './shared/components/not-found/not-found.component';
import { Layout } from './layout/layout';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: '', redirectTo: 'characters', pathMatch: 'full' },
      {
        path: 'characters',
        component: CharacterList,
      },
      {
        path: 'characters/:id',
        component: CharacterDetails,
      },
    ],
  },
  { path: '404', component: NotFound },
  { path: '**', redirectTo: '404' },
];
