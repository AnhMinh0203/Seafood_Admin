import { Component, inject } from '@angular/core';
import { Dialog, DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { Menu, MenuModule } from 'primeng/menu';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { FormsModule } from '@angular/forms';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';
import {
  DatatableComponent,
  DataTableColumnDirective,
  ColumnMode,
  SelectionType,

  ActivateEvent,
  DataTableColumnCellDirective,
  DataTableColumnHeaderDirective,

} from '@swimlane/ngx-datatable';
import { Employee } from 'src/app/product/data.model';
import { ConfirmDialog, ConfirmDialogModule } from "primeng/confirmdialog";
import { TableModule } from "primeng/table";
import { Toast, ToastModule } from "primeng/toast";
import { Toolbar, ToolbarModule } from "primeng/toolbar";
import { CategoryDto } from 'src/app/proxy/categories/dtos';
import { CategoryService } from '../proxy/controllers/category.service';
import { CardModule } from '@abp/ng.theme.shared';
import { CommonModule } from '@angular/common';
import { EditorModule } from 'primeng/editor';
import { FileUploadModule } from 'primeng/fileupload';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { MultiSelectModule } from 'primeng/multiselect';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { SelectModule } from 'primeng/select';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TagModule } from 'primeng/tag';
import { ProductForm } from 'src/app/product/product-form/product-form';
import { ProductPreview } from 'src/app/product/product-preview/product-preview';

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}
@Component({
  selector: 'app-unit',
  imports: [
    DatatableComponent,
    DataTableColumnDirective,
    DataTableColumnHeaderDirective,
    DataTableColumnCellDirective,
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
    ProductForm,
    ConfirmDialogModule,
    Dialog,
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
    ProductPreview,
    DialogModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './category.html',
  styleUrl: './category.scss'
})
export class Category {
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private CategoryService = inject(CategoryService);

  isFormVisible: boolean = false;
  isEditMode: boolean = false;
  newCategoryName: string = '';

  // columnItems: MenuItem[] | undefined;
  // actionItems: MenuItem[] | undefined;
  rows: CategoryDto[] = [];
  totalRecords: number = 0;

  pageSize = 5;
  pageIndex = 0;
  // selected: Employee[] = [];
  // ColumnMode = ColumnMode;
  // SelectionType = SelectionType;
  // unitName: string = '';
  cols!: Column[];
  selectedCategories: CategoryDto[] | null;
  selectedCategory: CategoryDto | null = null;
  messages = {
    totalMessage: 'tổng cộng',
    selectedMessage: 'đã chọn',
    emptyMessage: 'Không có dữ liệu'
  };

  onActivate(event: ActivateEvent<Employee>) {
    console.log('Activate Event', event);
  }
  addCategory() {

    this.isFormVisible = true;
    this.isEditMode = false;
  }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {

    const input = {
      skipCount: this.pageIndex * this.pageSize,
      maxResultCount: this.pageSize
    };

    this.CategoryService.getListByInput(input).subscribe({
      next: (res) => {
        console.log('Categories loaded:', res);
        this.rows = res.items;
        console.log('Rows set to:', this.rows);
        this.totalRecords = res.totalCount;
      }
    });
  }

  onSubmitNewCategory() {
    if (!this.newCategoryName.trim()) {
      this.messageService.add({ severity: 'warn', summary: 'Tên danh mục không được để trống' });
      return;
    } else {
      this.CategoryService.createByInput({ name: this.newCategoryName }).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Thêm danh mục thành công' });
          this.newCategoryName = '';
          this.loadCategories();
        }
      });
    }
  }

  onSubmit() {
    if (this.isEditMode) {
      this.onSave();
    } else {
      this.onCreate();
    }
  }

  onSave() {
    if (!this.newCategoryName.trim()) {
      this.messageService.add({ severity: 'warn', summary: 'Cảnh báo', detail: 'Tên danh mục không được để trống' });
      return;
    }
    console.log('Saving category', this.selectedCategory);
    this.CategoryService.updateByIdAndInput(this.selectedCategory.id, { name: this.newCategoryName    }).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: "Thông báo", detail: 'Cập nhật danh mục thành công' });
        this.newCategoryName = '';
        this.loadCategories();
      }
    });
    this.isFormVisible = false;
  }

  onCreate() {
    if (!this.newCategoryName.trim()) {
      this.messageService.add({ severity: 'warn', summary: 'Cảnh báo', detail: 'Tên danh mục không được để trống' });

      return;
    }
    this.CategoryService.createByInput({ name: this.newCategoryName }).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: "Thông báo", detail: 'Thêm danh mục thành công' });
        this.newCategoryName = '';
        this.loadCategories();
      }
    });
    this.isFormVisible = false;
  }

  onPage(event: any) {

    this.pageIndex = event.page;
    this.pageSize = event.rows;

    this.loadCategories();
  }

  editCategory(category: CategoryDto) {
    console.log('Editing category', category);
    this.isEditMode = true;
    this.selectedCategory = category;
    this.newCategoryName = category.name;

    this.isFormVisible = true;
  }

  deleteCategory(category:any) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa danh mục này không?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.CategoryService.deleteById(category.id).subscribe({
          next: (res) => {
              console.log("res",res);
            if(res.isSuccess != true){
             
              this.messageService.add({ severity: 'warn', summary: 'Lỗi', detail: res.message });
              return;
            }
            this.messageService.add({ severity: 'success', summary: 'Thành công', detail: res.message });
            this.loadCategories();
          }
        });
      }
    });
  }

  deleteBatchCategories(){
    const ids = this.selectedCategories.map(c => c.id);
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa các danh mục đã chọn không?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.CategoryService.batchDeleteByIds(ids).subscribe({
          next: (res) => {
             console.log("res",res);
            if(res.isSuccess != true){
             
              this.messageService.add({ severity: 'warn', summary: 'Lỗi', detail: res.message });
              return;
            }
            this.messageService.add({ severity: 'success', summary: 'Thành công', detail: res.message });
            this.loadCategories();
          },
          error: (err) => {
            console.error('Error deleting categories', err);
            this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: err.message });
          }
        });
      }
    });
  }
}
