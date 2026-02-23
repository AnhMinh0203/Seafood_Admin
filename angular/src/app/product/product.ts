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
import { ProductDto } from 'src/app/proxy/products/dtos';


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
    ProductForm
  ],
  templateUrl: './product.html',
  styleUrl: './product.scss'
})
export class Product {
  @ViewChild('rowMenu') rowMenu!: Menu;

  rows: ProductDto[] = [];
  selected: ProductDto[] = [];
  temp: ProductDto[] = [];
  pageSize = 3;
  pageIndex = 0;
  totalCount = 0;




  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  selectedField: keyof ProductDto = 'name';


  coverImageDisplay: any;
  coverImage: any;
  description: any;
  selectedUnits: any[] = [];


  units = [
    { name: 'Kilogram (kg)', code: 'kg' },
    { name: 'Gram (g)', code: 'g' },
    { name: 'Piece (pc)', code: 'pc' },
    { name: 'Box', code: 'box' }
  ]

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

  openRowMenu(event: Event, row: Employee) {
    this.rowActions = [
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => this.update(row)
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => this.remove(row)
      }
    ];
    this.rowMenu.toggle(event);
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
  categories = [
    { id: 1, name: 'Hải sản' },
    { id: 2, name: 'Nông sản' }
  ];

  // ---
  isFormVisible = false;
  isEditMode = false;
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
      // this.mapProducts(res.items);

      console.log('Response products:', res);
    });

  }

  // mapProducts(data: any[]) {
  //   this.rows = data.map(p => {
  //     const defaultUnit = p.units?.find((u: any) => u.isDefault);

  //     return {
  //       ...p,
  //       defaultPrice: defaultUnit?.price ?? 0,
  //       defaultUnitName: defaultUnit?.unitName ?? '',
  //       stockQuantity: defaultUnit?.stockQuantity ?? 0
  //     };
  //   });
  // }

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
  add() {
    console.log('Adding new product');
    this.isEditMode = false;
    this.isFormVisible = true;
  }

  closeForm() {
    this.isFormVisible = false;
  }

  // onSave(input: CreateUpdateProductDto) {
  // input.productId = 1; 
  // input.coverImage =  'https://picsum.photos/600/400';

  //   this.productService.create(input).subscribe({
  //     next: () => {
  //       this.isFormVisible = false;
  //       this.loadProducts();
  //     }
  //   });

  // }


  // ---



  update(row) {
    this.selected = [this.rows[1], this.rows[3]];
  }

  remove(row) {
    this.selected = [];
  }

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
      // this._responseHandler.showWarning('Kích thước ảnh không được lớn hơn 8MB');
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
}
