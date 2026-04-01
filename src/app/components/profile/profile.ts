import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'profile',
  providers: [provideNativeDateAdapter()],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  isEditing = signal(false);
  isPosting = signal(false);
  hasError = signal(false);

  user = this.authService.user;
  defaultImg = 'assets/img/avatar.svg';

  public profileForm = this.fb.group({
    nickname: [this.user()?.nickname || ''],
    imgProfile: [this.user()?.imgProfile || '', [Validators.required]],
    city: [this.user()?.city || '', [Validators.minLength(3)]],
    state: [this.user()?.state || '', [Validators.minLength(3)]],
    birthdate: [this.user()?.birthdate || ''],
  });

  onUpdateProfile() {
    if (this.profileForm.invalid) return;
    console.log('Profile updated', this.profileForm.value);
  }

  toggleEdit() {
    this.isEditing.update((val) => !val);
  }

  onSave() {
    if (this.profileForm.invalid || !this.user()?.id) {
      this.showError();
      return;
    }

    this.isPosting.set(true);
    const updatedData = this.profileForm.getRawValue() as any;

    const body = {
      ...updatedData,
      birthdate:
        updatedData.birthdate instanceof Date
          ? updatedData.birthdate.toISOString().split('T')[0]
          : updatedData.birthdate,
    };

    this.authService.updateProfile(this.user()!.id, body).subscribe({
      next: (user) => {
        console.log('DB updated', user);
        this.isEditing.set(false);
        this.isPosting.set(false);
      },
      error: (err) => {
        console.error('Error:', err);
        this.isPosting.set(false);
        this.showError();
      },
    });

    console.log('Profile saved', updatedData);
    this.isEditing.set(false);
    this.isPosting.set(true);
  }

  private showError() {
    this.hasError.set(true);
    setTimeout(() => this.hasError.set(false), 2000);
  }
}
