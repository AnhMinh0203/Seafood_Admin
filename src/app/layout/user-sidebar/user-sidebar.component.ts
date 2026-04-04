import { CommonModule } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserSidebarService } from '../../shared/services/user-sidebar.service';

@Component({
  selector: 'app-user-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-sidebar.component.html',
  styleUrl: './user-sidebar.component.scss'
})
export class UserSidebarComponent {
  sidebarService = inject(UserSidebarService);

  close(): void {
    this.sidebarService.close();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.sidebarService.isOpen()) {
      this.close();
    }
  }
}