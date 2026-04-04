import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Blog } from '../../shared/models/blog.model';
import { BLOG_FAKE_DATA } from '../../shared/mock-data/blog.mock';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './blog-detail.component.html',
  styleUrl: './blog-detail.component.scss'
})
export class BlogDetailComponent {
  private route = inject(ActivatedRoute);

  blog: Blog | undefined;

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.blog = BLOG_FAKE_DATA.find(x => x.id === id);
  }
}