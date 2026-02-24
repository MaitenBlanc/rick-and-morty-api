import { Component, input } from '@angular/core';
import { Character } from '../../core/models/character.model';

@Component({
  selector: 'app-character-card',
  standalone: true,
  imports: [],
  templateUrl: './character-card.component.html',
  styleUrl: './character-card.component.css',
})
export class CharacterCard {
  character = input<Character>();
}
