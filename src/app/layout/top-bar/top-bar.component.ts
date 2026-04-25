import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../shared/services/cart.service';
import { RouterModule } from '@angular/router';
import { UserSidebarService } from '../../shared/services/user-sidebar.service';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss'
})
export class TopBarComponent {
  cartService = inject(CartService);
  userSidebarService = inject(UserSidebarService);

  openUserSidebar(): void {
    this.userSidebarService.open('top-bar');
  }

}