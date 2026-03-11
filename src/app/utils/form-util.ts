import { FormArray, FormGroup, ValidationErrors } from '@angular/forms';

export class FormUtils {
  static getTextError(errors: ValidationErrors) {
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'This field is required';

        case 'minlength':
          return `Minimun ${errors['minlength'].requiredLength} characters`;

        case 'email':
          return 'Email is not valid';

        case 'pattern':
          return 'Must contain at least one uppercase letter and one number';

        case 'notEqual':
          return 'Passwords are not equal';
      }
    }
    return null;
  }

  static isValidField(form: FormGroup, fieldName: string): boolean | null {
    const control = form.controls[fieldName];
    return !!control.errors && (control.dirty || control.touched);
  }

  static isPerfectField(form: FormGroup, fieldName: string): boolean {
    const control = form.controls[fieldName];
    return !control.errors && (control.dirty || control.touched);
  }

  static getFieldError(form: FormGroup, fieldName: string): string | null {
    const control = form.controls[fieldName];
    if (!control || !control.errors) return null;

    const errors = control.errors;
    const messages: string[] = [];
    const value = control.value || '';

    if (errors['required']) messages.push('This field is required');
    if (errors['minlength'])
      messages.push(`Minimum ${errors['minlength'].requiredLength} characters`);
    if (errors['email']) messages.push('Email is not valid');
    if (errors['notEqual']) messages.push('Passwords are not equal');

    if (errors['pattern']) {
      if (fieldName === 'zip') messages.push('Zip code should be a number');

      if (fieldName === 'password') {
        if (!/(?=.*[A-Z])/.test(value)) messages.push('At least one uppercase letter required');
        if (!/(?=.*[0-9])/.test(value)) messages.push('At least one number required');
      }
    }

    return messages.length > 0 ? messages.join('\n') : null;
  }
}
