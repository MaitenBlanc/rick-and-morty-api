import { Component } from '@angular/core';
import { Navbar } from "../shared/components/navbar/navbar.component";
import { Footer } from "../shared/components/footer/footer.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [Navbar, RouterOutlet, Footer],
  templateUrl: './layout.html',
})
export class Layout {}
