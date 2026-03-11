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
    if (!form.controls[fieldName]) return null;
    const errors = form.controls[fieldName].errors ?? {};

    if (errors['pattern']) {
      if (fieldName === 'zip') return 'Zip code should be a number';
      if (fieldName === 'password') return 'At least one uppercase and one number required';
    }

    return FormUtils.getTextError(errors);
  }
}
