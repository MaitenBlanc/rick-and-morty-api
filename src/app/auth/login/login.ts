import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: `./login.html`,
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  private isPosting = signal(false);
  private hasError = signal(false);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      this.showError();
      return;
    }
    this.isPosting.set(true);

    const { email, password } = this.loginForm.getRawValue();

    this.authService.login(email!, password!).subscribe({
      next: (isAuthenticated) => {
        if (isAuthenticated) {
          this.router.navigateByUrl('/characters');
        } else {
          this.isPosting.set(false);
          this.showError();
        }
      },
      error: () => {
        this.isPosting.set(false);
        this.showError();
      },
    });
  }

  private showError() {
    this.hasError.set(true);
    setTimeout(() => this.hasError.set(false), 2000);
  }
}
