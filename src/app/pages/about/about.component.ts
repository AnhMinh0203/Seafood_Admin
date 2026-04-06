import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {


  constructor(private router: Router) {

  }

  get isAboutPage(): boolean {
    return this.router.url.includes('/about');
  }
}