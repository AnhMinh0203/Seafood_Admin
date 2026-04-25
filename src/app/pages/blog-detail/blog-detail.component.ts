import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BlogDto } from '../../shared/models/blog.model';
import { BLOG_FAKE_DATA } from '../../shared/mock-data/blog.mock';
import { BlogService } from '../../shared/services/blog.service';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './blog-detail.component.html',
  styleUrl: './blog-detail.component.scss'
})
export class BlogDetailComponent {
  private route = inject(ActivatedRoute);
  blogId: number = 0;
  blog: BlogDto | undefined;

  constructor(
    private blogService: BlogService,
    private toast: ToastService

  ) {
    const blogId = Number(this.route.snapshot.paramMap.get('id'));
    this.getBlogDetail(blogId);
    //this.blog = BLOG_FAKE_DATA.find(x => x.id === blogId);
  }

  getBlogDetail(blogId: number): void {

    this.blogService.getDetail(blogId).subscribe({
      next: (res) => {
        this.blog = res;
      },
      error: (err) => {
        console.log(err)
        this.toast.error(err);
      }
    });
  }
}