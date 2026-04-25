import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-floating-contact',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './floating-contact.component.html',
  styleUrl: './floating-contact.component.scss'
})
export class FloatingContactComponent {
  hotline = '0869819316';
  zaloPhone = '0869819316';
}