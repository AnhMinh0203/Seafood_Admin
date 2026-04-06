import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Blog } from '../../shared/models/blog.model';
import { BLOG_FAKE_DATA } from '../../shared/mock-data/blog.mock';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss'
})
export class BlogComponent {
  blogs: Blog[] = BLOG_FAKE_DATA;
  constructor(private router: Router) {

  }

  get isBlogPage(): boolean {
    return this.router.url.includes('/blog');
  }

  trackByBlogId(index: number, item: Blog): number {
    return item.id;
  }
}