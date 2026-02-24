import { Routes } from '@angular/router';
import { CharacterList } from './components/character-list/character-list.component';
import { CharacterDetails } from './components/character-details/character-details.component';
import { NotFound } from './components/not-found/not-found.component';

export const routes: Routes = [
    {path: '', redirectTo: 'characters', pathMatch: 'full'},
    {path: 'characters', component: CharacterList},
    {path: 'characters/:id', component: CharacterDetails},
    {path: '404', component: NotFound},
    {path: '**', redirectTo: '404'},
];
