import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { FormUtils } from '../../utils/form-util';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: `./login.html`,
  styleUrl: './login.css',
})
export class Login {
  formUtils = FormUtils;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  private isPosting = signal(false);
  private hasError = signal(false);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern('(?=.*[A-Z])(?=.*[0-9]).*'),
      ],
    ],
  });

  isValidField(field: string) {
    return FormUtils.isValidField(this.loginForm, field);
  }

  isPerfectField(field: string) {
    return FormUtils.isPerfectField(this.loginForm, field);
  }

  getFieldError(field: string) {
    return FormUtils.getFieldError(this.loginForm, field);
  }

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
