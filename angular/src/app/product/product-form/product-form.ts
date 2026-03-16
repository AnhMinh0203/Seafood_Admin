import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { EditorModule } from 'primeng/editor';
import { FileUploadModule } from 'primeng/fileupload';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from "primeng/button";
import { CategoryService } from '../../proxy/controllers/category.service';
import { CategoryDto } from 'src/app/proxy/categories/dtos';
import { CreateProductDto } from 'src/app/proxy/products/dtos';
import { ProductService } from 'src/app/proxy/controllers/product.service';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from "primeng/toast";
@Component({
  selector: 'app-product-form',
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
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss'
})
export class ProductForm implements OnChanges {

  @Input() visible = false;
  @Input() isEditMode = false;
  @Input() product: any;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<FormData>();

  private categoryService = inject(CategoryService);
  private productService = inject(ProductService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  form: any = {
    name: '',
    origin: '',
    slug: '',
    description: '',
    categoryId: null,
    units: []
  };

  coverFile!: File;
  childFiles: File[] = [];
  units = [];
  unitIdCounter = 0;
  categories: CategoryDto[] = [];
  selectedCategoryId: number | null = null;
  selectedUnits: any[] = [];
  previewCover: any = null;
  previewImages: any[] = [];

  totalRecords: number = 0;

  pageSize = 100;
  pageIndex = 0;

  ngOnInit() {
    const input = {
      skipCount: this.pageIndex * this.pageSize,
      maxResultCount: this.pageSize
    };
    this.categoryService.getList(input).subscribe(res => {
      this.categories = res.items;
      console.log('Categories:', this.categories);
    });
  }

  ngOnChanges() {
    console.log('Changes detected in ProductForm:', this.product);
    this.form = {
      name: this.product.name,
      origin: this.product.origin,
      slug: this.product.slug,
      description: this.product.description,
      categoryId: this.product.categoryId,
    };
    this.selectedCategoryId = this.product.categoryId;
    this.units = this.product.units ? [...this.product.units] : [];
    const cover = this.product.coverImage;

    this.previewCover = cover
      ? (cover.startsWith('http') ? cover : 'https://' + cover)
      : null;
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : '';
  }

  addUnit() {
    const newUnit = {
      id: this.unitIdCounter++,
      unitName: null,
      price: null,
      stockQuantity: null,
      isDefault: false
    };
    this.units = [...this.units, newUnit];
  }

  removeSelectedUnits() {
    if (!this.selectedUnits || this.selectedUnits.length === 0) return;
    this.units = this.units.filter(
      unit => !this.selectedUnits.includes(unit)
    );
    this.selectedUnits = [];
  }

  onCoverSelect(event: any) {
    const file = event.files[0];
    this.coverFile = file;
    this.previewCover = URL.createObjectURL(file);
  }
  onImagesSelect(event: any) {
    for (let file of event.files) {
      this.childFiles.push(file);
      this.previewImages.push(URL.createObjectURL(file));
    }
  }

  onCancel() {
    this.previewCover = null;
    this.close.emit();
  }

  onDefaultChange(selectedUnit: any) {
    this.units.forEach(unit => unit.isDefault = false);
    selectedUnit.isDefault = true;
  }

  onCreate() {
    if (!this.form.name) {
      this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Product name is required' });
      return;
    }
    if (!this.selectedCategoryId) {
      this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Category is required' });
      return;
    }

    if (this.units.length === 0) {
      this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'At least one unit is required' });
      return;
    }
    const defaultUnits = this.units.filter(u => u.isDefault);
    if (defaultUnits.length !== 1) {
      this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Exactly one default unit is required' });
      return;
    }

    if (!this.coverFile) {
      this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Cover image is required' });
      return;
    }

    const input: CreateProductDto = {
      name: this.form.name,
      origin: this.form.origin,
      slug: this.form.slug || '',
      description: this.form.description,
      categoryId: this.selectedCategoryId,
      units: this.units,
      coverImage: this.coverFile
    };

    this.productService.createProduct(input, this.childFiles)
      .subscribe({
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

  onSubmit() {
    if (this.isEditMode) {
      this.onSave();
    } else {
      this.onCreate();
    }
  }

  onSave() {
    if (!this.form.name) {
      this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Product name is required' });
      return;
    }
    if (!this.selectedCategoryId) {
      this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Category is required' });
      return;
    }
    if (this.units.length === 0) {
      this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'At least one unit is required' });
      return;
    }
    const defaultUnits = this.units.filter(u => u.isDefault);
    if (defaultUnits.length !== 1) {
      this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Exactly one default unit is required' });
      return;
    }
    const input: CreateProductDto = {
      name: this.form.name,
      origin: this.form.origin,
      slug: this.form.slug || '',
      description: this.form.description,
      categoryId: this.selectedCategoryId,
      units: this.units,
      coverImage: this.coverFile
    };

    this.productService.updateProduct(this.product.id, input, this.childFiles)
      .subscribe({
        next: (res) => {
          console.log('Updated successfully', res);
          this.visible = false;
          this.close.emit();
          this.save.emit();
        },
        error: (err) => {
          console.error(err);
        }
      });
  }

  onCategoryChange(value: number) {
    console.log('Category Id:', value);
  }
}
