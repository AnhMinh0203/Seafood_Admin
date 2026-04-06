import { Component } from '@angular/core';
import { AboutComponent } from "../about/about.component";
import { BannerComponent } from "../../layout/banner/banner.component";
import { ProductListComponent } from "../../shared/components/product-list/product-list.component";
import { MenuComponent } from "../menu/menu.component";
import { ContactComponent } from "../contact/contact.component";
import { BlogComponent } from "../blog/blog.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AboutComponent, BannerComponent, ProductListComponent, MenuComponent, ContactComponent, BlogComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
