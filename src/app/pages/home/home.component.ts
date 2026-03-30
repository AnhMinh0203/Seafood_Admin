import { Component } from '@angular/core';
import { AboutComponent } from "../about/about.component";
import { HeaderComponent } from "../../layout/header/header.component";
import { BannerComponent } from "../../layout/banner/banner.component";
import { ProductListComponent } from "../../shared/components/product-list/product-list.component";

@Component({
  selector: 'app-home',
  imports: [AboutComponent, HeaderComponent, BannerComponent, ProductListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
