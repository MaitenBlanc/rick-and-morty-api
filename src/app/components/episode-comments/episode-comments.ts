import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommentService } from '../../core/services/comment.service';
import { AuthService } from '../../core/services/auth.service';
import { Comment } from '../../core/interfaces/comment.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-episode-comments',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './episode-comments.html',
  styleUrl: './episode-comments.css',
})
export class EpisodeComments implements OnInit {
  episodeId = input.required<number>();

  private commentService = inject(CommentService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  public comments = this.commentService.comments;
  public currentUser = this.authService.user;
  public isLocked = this.commentService.isEpisodeLocked;
  public isAdmin = computed(() => {
    const roles = this.currentUser()?.roles;
    return roles ? roles.includes('admin') : false;
  });

  public isSubmitting = signal(false);
  public editingCommentId = signal<string | null>(null);

  public commentForm = this.fb.group({
    content: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(500)]],
  });

  ngOnInit(): void {
    this.commentService
      .getCommentsByEpisode(this.episodeId())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
    this.commentService.checkLockStatus(this.episodeId());
  }

  onSubmit() {
    if (this.commentForm.invalid) {
      this.commentForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const { content } = this.commentForm.getRawValue();
    const currentEditId = this.editingCommentId();

    if (currentEditId) {
      // Editar comentario
      this.commentService
        .updateComment(currentEditId, content!)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.cancelEdit();
            this.isSubmitting.set(false);
          },
          error: () => {
            this.isSubmitting.set(false);
          },
        });
    } else {
      // Crear comentario
      this.commentService
        .addComment(this.episodeId(), content!)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.commentForm.reset();
            this.isSubmitting.set(false);
          },
          error: () => {
            this.isSubmitting.set(false);
          },
        });
    }
  }

  startEdit(comment: Comment) {
    this.editingCommentId.set(comment.id);
    this.commentForm.patchValue({ content: comment.content });

    // scroll al form para editar
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }

  cancelEdit() {
    this.editingCommentId.set(null);
    this.commentForm.reset();
  }

  onDelete(id: string) {
    if (confirm('Are you sure you want to delete this comment?')) {
      this.commentService.deleteComment(id).subscribe({
        error: (err) => {
          console.error('Error deleting comment', err);
        },
      });
    }
  }

  toggleLock() {
    this.commentService.toggleEpisodeLock(this.episodeId()).subscribe(() => {
      this.commentService.checkLockStatus(this.episodeId());
    });
  }
}
