import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Blog } from '../../shared/models/blog.model';
import { BLOG_FAKE_DATA } from '../../shared/mock-data/blog.mock';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss'
})
export class BlogComponent {
  blogs: Blog[] = BLOG_FAKE_DATA;
  trackByBlogId(index: number, item: Blog): number {
    return item.id;
  }
}