import { Component, HostListener, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { CartService } from '../../shared/services/cart.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/services/auth.service';
import { ToastService } from '../../shared/services/toast.service';
@Component({
  selector: 'app-header',
  imports: [RouterModule, CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  cartService = inject(CartService);
  authService = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  dropdownOpen = false;

  toggleDropdown(event?: Event): void {
    event?.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown(): void {
    this.dropdownOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.dropdownOpen = false;
    this.toast.success('Đăng xuất thành công.');
    this.router.navigate(['/']);
  }

  get displayName(): string {
    return this.authService.currentUser()?.fullName || this.authService.currentUser()?.userName || 'Tài khoản';
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
