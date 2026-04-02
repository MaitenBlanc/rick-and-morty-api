import { HttpClient } from '@angular/common/http';
import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { Comment } from '../interfaces/comment.interface';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const BASE_URL = environment.baseUrl;

@Injectable({ providedIn: 'root' })
export class CommentService {
  private http = inject(HttpClient);
  private baseUrl = `${BASE_URL}/comments`;

  private destroyRef = inject(DestroyRef);

  public comments = signal<Comment[]>([]);
  public isEpisodeLocked = signal<boolean>(false);

  getCommentsByEpisode(episodeId: number) {
    return this.http
      .get<Comment[]>(`${this.baseUrl}/episode/${episodeId}`)
      .pipe(tap((res) => this.comments.set(res)));
  }

  addComment(episodeId: number, content: string) {
    return this.http.post<Comment>(this.baseUrl, { episodeId, content }).pipe(
      tap((newComment) => {
        this.comments.update((prev) => [newComment, ...prev]);
      }),
    );
  }

  updateComment(commentId: string, content: string) {
    return this.http.patch<Comment>(`${this.baseUrl}/${commentId}`, { content }).pipe(
      tap((updatedComment) => {
        this.comments.update((prev) =>
          prev.map((comment) =>
            comment.id === commentId ? { ...comment, content: updatedComment.content } : comment,
          ),
        );
      }),
    );
  }

  deleteComment(commentId: string) {
    return this.http.delete(`${this.baseUrl}/${commentId}`).pipe(
      tap(() => {
        this.comments.update((prev) => prev.filter((comment) => comment.id !== commentId));
      }),
    );
  }

  checkLockStatus(episodeId: number) {
    this.http
      .get<boolean>(`${this.baseUrl}/lock-status/${episodeId}`)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((status) => this.isEpisodeLocked.set(status));
  }

  toggleEpisodeLock(episodeId: number) {
    return this.http.patch(`${this.baseUrl}/lock/${episodeId}`, {});
  }

  getLockedEpisodes() {
    return this.http.get<number[]>(`${this.baseUrl}/admin/locked`);
  }
}
