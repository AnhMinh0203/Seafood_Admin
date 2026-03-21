import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { EditorModule } from 'primeng/editor';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { BlogService } from '../../proxy/controllers/blog.service';
import { BlogDto, CreateBlogDto } from 'src/app/proxy/blogs/dtos/models';

@Component({
  selector: 'app-blog-form',
  imports: [
    EditorModule,
    FileUploadModule,
    FormsModule,
    DialogModule,
    MultiSelectModule,
    SelectModule,
    InputTextModule,
    ButtonModule,
    TableModule,
    CheckboxModule,
    CommonModule,
    ToastModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './blog-form.html',
  styleUrl: './blog-form.scss'
})
export class BlogForm {
  @Input() visible = false;
  @Input() isEditMode = false;
  @Input() blogInput: any;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<FormData>();


  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private blogService = inject(BlogService);

  ngOnChanges() {
    if (this.isEditMode && this.blogInput) {
      this.blog = {
        id: this.blogInput.id,
        title: this.blogInput.title,
        content: this.blogInput.content
      };

      this.previewCover = this.blogInput.coverImage;
      this.coverFile = null!;
      this.previewCover = this.getFullUrl(this.blogInput.coverImage);
      console.log('Blog input changed', this.blogInput);
    } else {
      this.resetForm();
    }
  }

  previewCover: any = null;
  coverFile!: File;

  blog: any = {
    id: null,
    title: '',
    content: ''
  };

  onCancel() {
    this.previewCover = null;
    this.close.emit();
  }

  onCoverSelect(event: any) {
    const file = event.files[0];
    this.coverFile = file;
    this.previewCover = URL.createObjectURL(file);
  }

  onSubmit() {
    if (!this.blog.title) {
      this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Title is required' });
      return;
    }

    if (!this.blog.content) {
      this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Content is required' });
      return;
    }

    if (this.isEditMode) {
      this.onUpdate();
    } else {
      this.onCreate();
    }
  }

  onUpdate() {
    console.log('Updating blogInput', this.blogInput);
    console.log('Updating blog', this.blog);
    this.blogService.updateBlog(this.blog.id, {
      title: this.blog.title,
      content: this.blog.content,
      coverImage: this.coverFile
    }).subscribe({
      next: () => {
        this.afterSave();
      },
      error: (err) => console.error(err)
    });
  }

  onCreate() {
    if (!this.coverFile) {
      this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Cover image is required' });
      return;
    }

    this.blogService.createBlog({
      title: this.blog.title,
      content: this.blog.content,
      coverImage: this.coverFile
    }).subscribe({
      next: (res) => {
        console.log('Success', res);
        this.visible = false;
        this.close.emit();
        this.save.emit();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  afterSave() {
    this.visible = false;
    this.close.emit();
    this.save.emit();
    this.resetForm();
  }
  resetForm() {
    this.blog = {
      title: '',
      content: ''
    };
    this.coverFile = null!;
    this.previewCover = null;
  }

  getFullUrl(url: string) {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return 'https://' + url;
  }
}
