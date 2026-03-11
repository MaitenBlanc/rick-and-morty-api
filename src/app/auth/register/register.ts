import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormUtils } from '../../utils/form-util';
import { RegisterFormData } from '../interfaces/auth.interface';

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  formUtils = FormUtils;

  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);

  hasError = signal(false);
  isPosting = signal(false);

  registerForm = this.fb.group(
    {
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern('(?=.*[A-Z])(?=.*[0-9]).*'),
        ],
      ],
      repeatPassword: ['', [Validators.required]],
      address: ['', [Validators.required, Validators.minLength(8)]],
      city: ['', [Validators.required, Validators.minLength(6)]],
      state: ['', [Validators.required, Validators.minLength(6)]],
      zip: [, [Validators.required, Validators.pattern('^[0-9]*$')]],
    },
    {
      validators: [this.isFieldOneEqualFieldTwo('password', 'repeatPassword')],
    },
  );

  isFieldOneEqualFieldTwo(field1: string, field2: string) {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const fieldValue1 = formGroup.get(field1)?.value;
      const fieldValue2 = formGroup.get(field2)?.value;

      if (fieldValue1 !== fieldValue2) {
        formGroup.get(field2)?.setErrors({ notEqual: true });
        return { notEqual: true };
      }

      if (formGroup.get(field2)?.hasError('notEqual')) {
        delete formGroup.get(field2)?.errors?.['notEqual'];
        formGroup.get(field2)?.updateValueAndValidity();
      }

      return null;
    };
  }

  isValidField(field: string) {
    return FormUtils.isValidField(this.registerForm, field);
  }

  isPerfectField(field: string): boolean {
    return FormUtils.isPerfectField(this.registerForm, field);
  }

  getFieldError(field: string) {
    const control = this.registerForm.get(field);
    if (!control || !control.errors) return null;

    return FormUtils.getFieldError(this.registerForm, field);
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.showError();
      return;
    }

    this.isPosting.set(true);

    const formData = this.registerForm.getRawValue() as RegisterFormData;

    this.authService.register(formData).subscribe({
      next: () => {
        this.router.navigateByUrl('');
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
