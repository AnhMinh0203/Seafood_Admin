import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { MenuComponent } from './pages/menu/menu.component';
import { ContactComponent } from './pages/contact/contact.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, data: { showBanner: true } },
  { path: 'home', component: HomeComponent, data: { showBanner: false } },
  { path: 'about', component: AboutComponent, data: { showBanner: false } },
  { path: 'menu', component: MenuComponent, data: { showBanner: false } },
  { path: 'contact', component: ContactComponent, data: { showBanner: false } },
];
