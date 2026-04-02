import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';

export const authErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      // Error de login o registro
      if (err.status === 400 || err.status === 401) {
        const errorMessage = err.error.message || 'Credenciales inválidas';
        // Alerta visual
        Swal.fire({
          icon: 'error',
          title: 'Error de Autenticación',
          text: Array.isArray(errorMessage) ? errorMessage[0] : errorMessage,
          confirmButtonColor: '#00aff4'
        });
      }
      return throwError(() => err);
    }),
  );
};
