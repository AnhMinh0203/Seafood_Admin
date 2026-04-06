import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./layout/header/header.component";
import { FooterComponent } from "./layout/footer/footer.component";
import { BottomNavComponent } from "./layout/bottom-nav/bottom-nav.component";
import { TopBarComponent } from "./layout/top-bar/top-bar.component";
import { UserSidebarComponent } from "./layout/user-sidebar/user-sidebar.component";

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent, BottomNavComponent, TopBarComponent, UserSidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular';

  constructor(private router: Router) {
   
    
  }

  get isLoginPage(): boolean {
    return this.router.url.includes('/login')
  }

  get isRegisterPage(): boolean {
    return this.router.url.includes('/register')
  }
}
