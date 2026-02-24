import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BreadcrumbStep } from '../../core/models/breadcrumb.model';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.css',
})
export class Breadcrumb {

  steps = input<BreadcrumbStep[]>([]);

}
