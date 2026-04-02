import { Component, inject, OnInit, DestroyRef, signal } from '@angular/core';
import { CommentService } from '../../core/services/comment.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'admin-dashboard',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatCardModule,
  ],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  private commentService = inject(CommentService);
  private destroyRef = inject(DestroyRef);
  private snackBar = inject(MatSnackBar);

  public lockedEpisodes = signal<any[]>([]);
  public displayedColumns: string[] = ['episodeId', 'createdAt', 'actions'];

  ngOnInit(): void {
    this.loadLockedEpisodes();
  }

  loadLockedEpisodes(): void {
    this.commentService
      .getLockedEpisodes()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (episodes) => this.lockedEpisodes.set(episodes),
        error: (error) => console.error('Error fetching locked episodes:', error),
      });
  }

  unlockEpisode(episodeId: number) {
    this.commentService
      .toggleEpisodeLock(episodeId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.lockedEpisodes.update((prev) => prev.filter((ep) => ep.episodeId !== episodeId));
          this.snackBar.open(`Episode ${episodeId} unlocked successfully`, 'Close', {
            duration: 3000,
            panelClass: ['bg-success', 'text-white'],
          });
        },
      });
  }
}
