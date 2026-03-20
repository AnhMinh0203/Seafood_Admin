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
import { BlogDto } from 'src/app/proxy/blogs/dtos/models';

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

  previewCover: any = null;
  coverFile!: File;
  blog:BlogDto = {
    id: 0,
    title: '',
    content: '',
    coverImage: '',
    creationTime: ''
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
    if (this.isEditMode) {
      //this.onSave();
    } else {
      //this.onCreate();
    }
  }
}
