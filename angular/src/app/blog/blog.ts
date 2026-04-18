import { Component, inject } from '@angular/core';
import { Dialog, DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { Menu, MenuModule } from 'primeng/menu';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { EditorModule } from 'primeng/editor';
import { MultiSelectModule } from 'primeng/multiselect';
import {
  ColumnMode,
  ActivateEvent,
} from '@swimlane/ngx-datatable';
import { Employee } from 'src/app/product/data.model';
import { Toast, ToastModule } from "primeng/toast";
import { Toolbar, ToolbarModule } from "primeng/toolbar";
import { TableModule } from "primeng/table";
import { ConfirmDialog, ConfirmDialogModule } from "primeng/confirmdialog";
import { SplitButtonModule } from 'primeng/splitbutton';
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { TagModule } from 'primeng/tag';
import { BlogForm } from "./blog-form/blog-form";
import { BlogService } from 'src/app/proxy/controllers/blog.service';
import { BlogDto, BlogListDto } from 'src/app/proxy/blogs/dtos/models';
import { BlogPreview } from "./blog-preview/blog-preview";

@Component({
  selector: 'app-unit',
  imports: [
    InputTextModule,
    InputGroupModule,
    InputGroupAddonModule,
    ButtonModule,
    MenuModule,
    SplitButtonModule,
    DialogModule,
    FileUploadModule,
    FormsModule,
    CardModule,
    SelectModule,
    MultiSelectModule,
    EditorModule,
    ConfirmDialogModule,
    IconFieldModule,
    InputIconModule,
    InputNumberModule,
    RadioButtonModule,
    RatingModule,
    TableModule,
    TagModule,
    ToastModule,
    ToolbarModule,
    CommonModule,
    DialogModule,
    BlogForm,
    BlogPreview
],
  providers: [MessageService, ConfirmationService],
  templateUrl: './blog.html',
  styleUrl: './blog.scss'
})
export class Blog {

  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private blogService = inject(BlogService);

  selectedBlogs: any;

  newBlog: any = {
    title: '',
    content: ''
  };

  blogs: BlogListDto[] = [];
  selectedBlog: BlogListDto | null = null;
  isAddFormVisible: boolean = false;
  columnItems: MenuItem[] | undefined;
  actionItems: MenuItem[] | undefined;
  rows: Employee[] = [];
  selected: Employee[] = [];
  ColumnMode = ColumnMode;
  isFormVisible = false;
  isEditMode = false;
  isPreViewMode = false;


  previewCover: any = null;

  cols: any;
  pageSize = 100;
  pageIndex = 0;

  ngOnInit() {
    this.loadBlogs();
  }

  loadBlogs() {
    const input = {
      skipCount: this.pageIndex * this.pageSize,
      maxResultCount: this.pageSize
    };
    this.blogService.getListByInput(input).subscribe({
      next: (res) => {
        this.blogs = res.items;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }


  onActivate(event: ActivateEvent<Employee>) {
    console.log('Activate Event', event);
  }
  add() {
    this.isAddFormVisible = true;
  }
  onCoverSelect(event: any) {
    const file = event.files[0];
    this.previewCover = URL.createObjectURL(file);
  }

  onSubmit() {
    throw new Error('Method not implemented.');
  }

  onPage($event: any) {
    throw new Error('Method not implemented.');
  }

  onBlogSaved() {
    this.isFormVisible = false;
    this.loadBlogs();

  }

  closeForm() {
    this.isFormVisible = false;
  }

  addBlog() {
    console.log('Adding new blog');
    this.isFormVisible = true;
    this.previewCover = null;
    this.isEditMode = false;
  }

  getImageUrl(url: string): string {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return 'https://' + url;
  }

  editBlog(blog: BlogListDto) {
    console.log('Editing blog', blog);
    this.isEditMode = true;
    this.newBlog = { ...blog };
    this.isFormVisible = true;
  }

  deleteBlog(blog: any) {

    this.confirmationService.confirm({
      message: `Bạn có chắc muốn xóa sản phẩm "${blog.name}"?`,
      header: 'Xác nhận xóa',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xóa',
      rejectLabel: 'Hủy',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {

        this.blogService.deleteBlog(blog.id)
          .subscribe({
            next: () => {
              console.log('Deleted successfully');
              this.loadBlogs();
            },
            error: (err) => {
              console.error(err);
            }
          });

      }
    });

  }

  deleteBatchBlogs() {

    if (!this.selectedBlogs || this.selectedBlogs.length === 0) {
      return;
    }

    const ids = this.selectedBlogs.map(b => b.id);

    this.confirmationService.confirm({
      message: `Bạn có chắc muốn xóa ${ids.length} blog đã chọn?`,
      header: 'Xác nhận xóa',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xóa',
      rejectLabel: 'Hủy',
      acceptButtonStyleClass: 'p-button-danger',

      accept: () => {

        this.blogService.batchDeleteBlogs(ids)
          .subscribe({
            next: (res) => {

              if (res.isSuccess) {

                this.messageService.add({
                  severity: 'success',
                  summary: 'Thành công',
                  detail: res.message
                });

                this.loadBlogs();        
                this.selectedBlogs = null; 
              }
            },

            error: (err) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Lỗi',
                detail: err.error?.message
              });
            }
          });
      }
    });
  }

  viewBlog(blog: any) {
    this.selectedBlog = blog;
    this.isPreViewMode = true;
    console.log('Viewing blog', blog);
  }

  handlePreviewClose() {
    this.isPreViewMode = false;
    this.selectedBlog = null;
  }
}
