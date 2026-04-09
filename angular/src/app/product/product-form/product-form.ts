import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { EditorModule } from 'primeng/editor';
import { FileUploadModule } from 'primeng/fileupload';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';

import { CategoryService } from '../../proxy/controllers/category.service';
import { ProductService } from '../../proxy/controllers/product.service';

import { CategoryDto } from 'src/app/proxy/categories/dtos';
import { CreateProductDto, UpdateProductPayload } from 'src/app/proxy/products/dtos';
import { ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';

interface ExistingImageVm {
  imageUrl: string;
  displayOrder: number;
}

interface NewImagePreviewVm {
  file: File;
  previewUrl: string;
}

@Component({
  selector: 'app-product-form',
  standalone: true,
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
export class ProductForm implements OnInit, OnChanges {
  @Input() visible = false;
  @Input() isEditMode = false;
  @Input() product: any;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();
  @ViewChild('childUpload') childUpload?: FileUpload;


  private categoryService = inject(CategoryService);
  private productService = inject(ProductService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  form: any = {
    name: '',
    origin: '',
    slug: '',
    description: '',
    categoryId: null
  };

  coverFile: File | null = null;
  childFiles: File[] = [];
  previewCover: string | null = null;

  // Ảnh cũ từ server
  existingImages: ExistingImageVm[] = [];

  // Danh sách URL ảnh cũ bị xóa
  deletedImageUrls: string[] = [];

  // Ảnh mới user chọn
  previewImages: NewImagePreviewVm[] = [];

  units: any[] = [];
  unitIdCounter = 0;
  categories: CategoryDto[] = [];
  selectedCategoryId: number | null = null;
  selectedUnits: any[] = [];

  totalRecords = 0;
  pageSize = 100;
  pageIndex = 0;

  ngOnInit(): void {
    const input = {
      skipCount: this.pageIndex * this.pageSize,
      maxResultCount: this.pageSize
    };

    this.categoryService.getListByInput(input).subscribe(res => {
      this.categories = res.items;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && this.visible) {
      if (this.isEditMode && this.product) {
        this.bindEditData();
      } else if (!this.isEditMode) {
        this.resetForm();
      }
    }
  }

  private bindEditData(): void {
    if (!this.product) return;

    this.resetPreviewObjects();

    this.form = {
      name: this.product.name ?? '',
      origin: this.product.origin ?? '',
      slug: this.product.slug ?? '',
      description: this.product.description ?? '',
      categoryId: this.product.categoryId ?? null
    };

    this.selectedCategoryId = this.product.categoryId ?? null;
    this.units = this.product.units ? [...this.product.units] : [];
    this.selectedUnits = [];

    const cover = this.product.coverImage;
    this.previewCover = cover
      ? (cover.startsWith('http') ? cover : 'https://' + cover)
      : null;

    this.existingImages = this.product.images
      ? [...this.product.images]
        .sort((a: any, b: any) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
        .map((x: any) => ({
          imageUrl: x.imageUrl,
          displayOrder: x.displayOrder ?? 0
        }))
      : [];

    this.deletedImageUrls = [];
    this.childFiles = [];
    this.previewImages = [];

    this.unitIdCounter =
      this.units.length > 0
        ? Math.max(...this.units.map((x: any) => x.id ?? 0), 0) + 1
        : 1;

    this.coverFile = null;
  }

  private resetForm(): void {
    this.resetPreviewObjects();

    this.form = {
      name: '',
      origin: '',
      slug: '',
      description: '',
      categoryId: null
    };

    this.coverFile = null;
    this.childFiles = [];
    this.previewCover = null;
    this.previewImages = [];
    this.existingImages = [];
    this.deletedImageUrls = [];

    this.units = [];
    this.selectedUnits = [];
    this.selectedCategoryId = null;
    this.unitIdCounter = 1;
    this.childUpload?.clear();
  }

  private resetPreviewObjects(): void {
    this.previewImages.forEach(x => URL.revokeObjectURL(x.previewUrl));
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : '';
  }

  addUnit(): void {
    const newUnit = {
      id: this.unitIdCounter++,
      unitName: null,
      price: null,
      stockQuantity: null,
      isDefault: false
    };

    this.units = [...this.units, newUnit];
  }

  removeSelectedUnits(): void {
    if (!this.selectedUnits?.length) return;

    this.units = this.units.filter(unit => !this.selectedUnits.includes(unit));
    this.selectedUnits = [];
  }

  onCoverSelect(event: any): void {
    const file = event.files?.[0];
    if (!file) return;

    this.coverFile = file;
    this.previewCover = URL.createObjectURL(file);
  }

  onImagesSelect(event: any): void {
    const files: File[] = event.files ?? [];
    for (const file of files) {
      this.childFiles.push(file);
      this.previewImages.push({
        file,
        previewUrl: URL.createObjectURL(file)
      });
    }
  }

  removeExistingImage(img: ExistingImageVm): void {
    if (!this.deletedImageUrls.includes(img.imageUrl)) {
      this.deletedImageUrls.push(img.imageUrl);
    }

    this.existingImages = this.existingImages.filter(x => x.imageUrl !== img.imageUrl);
  }

  removeNewImage(item: NewImagePreviewVm): void {
    URL.revokeObjectURL(item.previewUrl);

    this.previewImages = this.previewImages.filter(x => x !== item);
    this.childFiles = this.childFiles.filter(x => x !== item.file);
  }

  onCancel(): void {
    this.resetForm();
    this.close.emit();
  }

  onDefaultChange(selectedUnit: any): void {
    this.units.forEach(unit => (unit.isDefault = false));
    selectedUnit.isDefault = true;
  }

  private validateForm(isCreate: boolean): boolean {
    if (!this.form.name?.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warn',
        detail: 'Product name is required'
      });
      return false;
    }

    if (!this.selectedCategoryId) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warn',
        detail: 'Category is required'
      });
      return false;
    }

    if (this.units.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warn',
        detail: 'At least one unit is required'
      });
      return false;
    }

    const defaultUnits = this.units.filter(u => u.isDefault);
    if (defaultUnits.length !== 1) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warn',
        detail: 'Exactly one default unit is required'
      });
      return false;
    }

    if (isCreate && !this.coverFile) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warn',
        detail: 'Cover image is required'
      });
      return false;
    }

    return true;
  }

  onCreate(): void {
    if (!this.validateForm(true)) return;

    const input: CreateProductDto = {
      name: this.form.name,
      origin: this.form.origin,
      slug: this.form.slug || '',
      description: this.form.description,
      categoryId: this.selectedCategoryId!,
      units: this.units,
      coverImage: this.coverFile as any
    };

    this.productService.createProduct(input, this.childFiles).subscribe({
      next: (res) => {
        console.log('Created successfully', res);
        this.visible = false;
        this.resetForm();
        this.close.emit();
        this.save.emit();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  onSave(): void {
    if (!this.validateForm(false)) return;

    // Nếu backend đã thêm DeletedImageUrls thì payload này phải khớp DTO đó
    // const input: any = {
    //   name: this.form.name,
    //   origin: this.form.origin,
    //   slug: this.form.slug || '',
    //   description: this.form.description,
    //   categoryId: this.selectedCategoryId!,
    //   units: this.units,
    //   coverImage: this.coverFile ?? undefined,
    //   deletedImageUrls: this.deletedImageUrls
    // };

    const input: UpdateProductPayload = {
      name: this.form.name,
      origin: this.form.origin,
      slug: this.form.slug || '',
      description: this.form.description,
      categoryId: this.selectedCategoryId!,
      units: this.units,
      coverImage: this.coverFile ?? null,
      deletedImageUrls: this.deletedImageUrls
    };

    console.log("update object: ",input);

    const filesToSend = this.childFiles.length ? this.childFiles : null;

    this.productService.updateProduct(this.product.id, input, filesToSend as any).subscribe({
      next: (res) => {
        console.log('Updated successfully', res);
        this.visible = false;
        this.resetForm();
        this.close.emit();
        this.save.emit();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  onSubmit(): void {
    if (this.isEditMode) {
      this.onSave();
    } else {
      this.onCreate();
    }
  }

  onCategoryChange(value: any): void {
    console.log('Category change:', value);
  }
}