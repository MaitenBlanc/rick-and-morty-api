import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'translate',
  standalone: true
})
export class TranslatePipe implements PipeTransform {

  transform(value: string | undefined): string {
    if (!value) return '';

    const lowerValue = value.toLocaleLowerCase();

    const translations: Record<string, string> = {
      'alive': 'Vivo',
      'dead': 'Muerto',
      'unknown': 'Desconocido',
      'male': 'Masculino',
      'female': 'Femenino',
      'genderless': 'Sin género'
    }

    return translations[lowerValue] || value;
  }

}
