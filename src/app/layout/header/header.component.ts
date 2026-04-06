import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { CartService } from '../../shared/services/cart.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-header',
  imports: [RouterModule, CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  cartService = inject(CartService);
}
