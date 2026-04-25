import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { CartService } from '../../shared/services/cart.service';
import { ToastService } from '../../shared/services/toast.service';
import { UserSidebarService } from '../../shared/services/user-sidebar.service';

@Component({
  selector: 'app-header',
  imports: [RouterModule, CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  cartService = inject(CartService);
  authService = inject(AuthService);
  userSidebarService = inject(UserSidebarService);

  private router = inject(Router);
  private toast = inject(ToastService);

  dropdownOpen = false;

  ngOnInit(): void {
    this.initializeHeaderState();
  }

  private initializeHeaderState(): void {
    this.authService.syncCurrentUser().subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        this.cartService.loadCartSilently();
      } else {
        this.cartService.clearCartState();
      }
    });
  }

  toggleDropdown(event?: Event): void {
    event?.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown(): void {
    this.dropdownOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.cartService.clearCartState();
    this.dropdownOpen = false;
    this.toast.success('Đăng xuất thành công.');
    this.router.navigate(['/']);
  }

  openUserSidebar(): void {
    this.userSidebarService.open('header');
  }

  get displayName(): string {
    return this.authService.currentUser()?.fullName
      || this.authService.currentUser()?.userName
      || 'Tài khoản';
  }

  get userInitial(): string {
    const name = this.displayName?.trim();
    return name ? name.charAt(0).toUpperCase() : 'U';
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.dropdownOpen = false;
  }
}