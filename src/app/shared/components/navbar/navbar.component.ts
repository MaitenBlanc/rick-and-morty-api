import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ApiService } from '../../../core/services/api.services';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class Navbar {
  private apiServices = inject(ApiService);

  counts = signal({
    characters: 0,
    episodes: 0,
  });

  ngOnInit() {
    this.apiServices.getGlobalCounts().subscribe((data) => {
      this.counts.set(data);
    });
  }
}
