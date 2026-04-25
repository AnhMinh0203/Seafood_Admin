import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { BlogDto, BlogListDto } from '../../shared/models/blog.model';
import { BlogService } from '../../shared/services/blog.service';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss'
})
export class BlogComponent implements OnInit {
  blogs: BlogListDto[] = [];
  loading = false;

  constructor(
    private router: Router,
    private blogService: BlogService
  ) {}

  ngOnInit(): void {
    this.getBlogs();
  }

  get isBlogPage(): boolean {
    return this.router.url.includes('/blog');
  }

  getBlogs(): void {
    this.loading = true;

    this.blogService.getList({
      skipCount: 0,
      maxResultCount: 100,
      sorting: 'creationTime desc'
    }).subscribe({
      next: (res) => {
        this.blogs = res.items || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Get blog list error:', err);
        this.blogs = [];
        this.loading = false;
      }
    });
  }

  trackByBlogId(index: number, item: BlogListDto): number {
    return item.id;
  }
}