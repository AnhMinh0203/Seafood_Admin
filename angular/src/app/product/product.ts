import { Component, ViewChild } from '@angular/core';
import { inject } from '@angular/core';
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
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ButtonModule } from 'primeng/button';
import { Menu, MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { SplitButtonModule } from 'primeng/splitbutton';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { EditorModule } from 'primeng/editor';
import { ProductService } from '../proxy/controllers/product.service';

import { ProductForm } from "./product-form/product-form";
import { CreateProductDto, ProductDto } from 'src/app/proxy/products/dtos';
// ----

import { OnInit } from '@angular/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Dialog } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { CategoryService } from 'src/app/proxy/controllers/category.service';
import { CategoryDto } from 'src/app/proxy/categories/dtos/models';
import { ProductPreview } from "./product-preview/product-preview";


interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}
@Component({
  selector: 'app-product',
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
    ProductPreview
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './product.html',
  styleUrl: './product.scss'
})
export class Product {
  @ViewChild('rowMenu') rowMenu!: Menu;
  private messageService = inject(MessageService);
  private categoryService = inject(CategoryService);
  private confirmationService = inject(ConfirmationService);

  rows: ProductDto[] = [];
  selected: ProductDto[] = [];
  temp: ProductDto[] = [];

  selectedProducts!: ProductDto[] | null;
  selectedProduct: ProductDto | null = null;
  // pageSize = 10;
  // pageIndex = 0;
   totalCount = 0;


  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  selectedField: keyof ProductDto = 'name';


  coverImageDisplay: any;
  coverImage: any;
  description: any;
  selectedUnits: any[] = [];
  cols!: Column[];
  categories: CategoryDto[] = [];

  units = [
    { name: 'Kilogram (kg)', code: 'kg' },
    { name: 'Gram (g)', code: 'g' },
    { name: 'Piece (pc)', code: 'pc' },
    { name: 'Box', code: 'box' }
  ]

  totalRecords: number = 0;
  pageSize = 100;
  pageIndex = 0;

  newProduct: any = {
    name: '',
    origin: '',
    description: '',
    categoryId: null,
    coverImage: '',
    images: [],
    units: []
  };

  rowActions: MenuItem[] = [];

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    const input = {
      skipCount: this.pageIndex * this.pageSize,
      maxResultCount: this.pageSize
    };
    this.categoryService.getListByInput(input).subscribe({
      next: (res) => {
        this.categories = res.items;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : '';
  }

  resetForm() {
    this.newProduct = {
      name: '',
      origin: '',
      description: '',
      categoryId: null,
      coverImage: '',
      images: [],
      units: []
    };
  }
  previewCover: any = null;

  // ---
  isFormVisible = false;
  isEditMode = false;
  isPreViewMode = false;
  // ---

  @ViewChild(DatatableComponent) table!: DatatableComponent<Employee>;

  columnItems: MenuItem[] | undefined;
  actionItems: MenuItem[] | undefined;
  previewImages: any[] = [];

  messages = {
    totalMessage: 'tổng cộng',
    selectedMessage: 'đã chọn',
    emptyMessage: 'Không có dữ liệu'
  };




  constructor(private productService: ProductService) {
    this.loadProducts();

  }

  // ---
  loadProducts() {
    this.productService.getListWithUnitsByInput({
      skipCount: this.pageIndex * this.pageSize,
      maxResultCount: this.pageSize,
      sorting: 'Name'
    }).subscribe(res => {
      this.rows = res.items;
      this.temp = [...res.items];
      this.totalCount = res.totalCount;
    });

  }

  getDefaultUnit(product: ProductDto) {
    return product.units?.find(u => u.isDefault);
  }

  onPage(event: any) {
    this.pageIndex = event.offset;

    this.loadProducts();
  }

  onActivate(event: ActivateEvent<Employee>) {
    console.log('Activate Event', event);
  }
  onCoverSelect(event: any) {
    const file = event.files[0];
    this.previewCover = URL.createObjectURL(file);
  }
  addProduct() {
    console.log('Adding new product');

    this.newProduct = {
      name: '',
      origin: '',
      slug: '',
      description: '',
      categoryId: null,
      units: [],
      coverImage: '',
      images: []
    };
    this.isFormVisible = true;
    this.previewCover = null;
    this.isEditMode = false;
  }

  editProduct(product: ProductDto) {
    console.log('Editing product', product);
    this.isEditMode = true;
    this.newProduct = { ...product };
    this.isFormVisible = true;
  }

  closeForm() {
    this.isFormVisible = false;
  }

  onProductSaved() {
    this.isFormVisible = false;
    this.loadProducts();

  }


  // ---






  updateFilter(event: KeyboardEvent) {
    const val = (event.target as HTMLInputElement).value.toLowerCase();
    const field = this.selectedField;
    // filter our data and update the rows
    this.rows = this.temp.filter(d => {
      const data = (d[field] ?? '').toString().toLowerCase();
      return data.includes(val) || !val;
    });

    this.table.offset = 0;
  }

  onCoverSelected(event: any) {
    const file = event.files[0];
    const reader = new FileReader();
    reader.onload = () => this.newProduct.coverImage = reader.result as string;
    reader.readAsDataURL(file);
  }

  onImagesSelected(event: any) {
    event.files.forEach((f: any) => {
      const reader = new FileReader();
      reader.onload = () => this.newProduct.images.push(reader.result as string);
      reader.readAsDataURL(f);
    });
  }
  saveProduct() {
    console.log('Saving product', this.newProduct);
  }
  addUnit() {
    console.log('Adding unit');
  }

  onImagesSelect(event: any) {
    for (let file of event.files) {
      this.previewImages.push(URL.createObjectURL(file));
    }
  }

  onUploadCoverImage(event: any) {
    const file = event.files[0];
    const maxSizeKB = 8000;

    if (file.size / 1024 > maxSizeKB) {
      alert('Kích thước ảnh không được lớn hơn 8MB');
      return;
    }

    const reader = new FileReader();
    this.coverImage = file;
    reader.onload = (e: any) => {
      this.coverImageDisplay = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  getSeverity(status: string) {
    switch (status) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warning';
      case 'OUTOFSTOCK':
        return 'danger';
      default:
        return 'info';
    }
  }

  getDefaultPrice(product: any): number | null {
    if (!product?.units?.length) return null;

    const defaultUnit = product.units.find(u => u.isDefault);
    return defaultUnit?.price ?? null;
  }

  getImageUrl(url: string): string {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return 'https://' + url;
  }

  deleteProduct(product: any) {

    this.confirmationService.confirm({
      message: `Bạn có chắc muốn xóa sản phẩm "${product.name}"?`,
      header: 'Xác nhận xóa',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xóa',
      rejectLabel: 'Hủy',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {

        this.productService.deleteProduct(product.id)
          .subscribe({
            next: () => {
              console.log('Deleted successfully');
              this.loadProducts(); // reload table
            },
            error: (err) => {
              console.error(err);
            }
          });

      }
    });

  }

  deleteBatchProducts() {

    if (!this.selectedProducts || this.selectedProducts.length === 0) {
      return;
    }

    const ids = this.selectedProducts.map(p => p.id);

    this.confirmationService.confirm({
      message: `Bạn có chắc muốn xóa ${ids.length} sản phẩm đã chọn?`,
      header: 'Xác nhận xóa',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xóa',
      rejectLabel: 'Hủy',
      acceptButtonStyleClass: 'p-button-danger',

      accept: () => {

        this.productService.batchDeleteProducts(ids)
          .subscribe({
            next: (res) => {

              if (res.isSuccess) {

                this.messageService.add({
                  severity: 'success',
                  summary: 'Thành công',
                  detail: res.message
                });

                this.loadProducts();        
                this.selectedProducts = null; 
              }
            },

            error: (err) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Lỗi',
                detail: err.error?.message || 'Xóa thất bại'
              });
            }
          });

      }
    });
  }

  viewProduct(product: any) {
    this.selectedProduct = product;
    this.isPreViewMode = true;
    console.log('Viewing product', product);
  }

  handlePreviewClose() {
    this.isPreViewMode = false;
    this.selectedProduct = null;
  }
}
