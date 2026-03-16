

import { Component } from '@angular/core';
import { Dialog, DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { Menu, MenuModule } from 'primeng/menu';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { FormsModule } from '@angular/forms';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { EditorModule } from 'primeng/editor';
import { MultiSelectModule } from 'primeng/multiselect';
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
import { ProductForm } from 'src/app/product/product-form/product-form';
import { ProductPreview } from 'src/app/product/product-preview/product-preview';

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
  providers: [MessageService, ConfirmationService],
  templateUrl: './blog.html',
  styleUrl: './blog.scss'
})
export class Blog {
  selectedBlogs: any;

  isFormVisible: any;
  newBlogName: any;

  isAddFormVisible: boolean = false;

  columnItems: MenuItem[] | undefined;
  actionItems: MenuItem[] | undefined;
  rows: Employee[] = [];
  selected: Employee[] = [];
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  unitName: string = '';

  messages = {
    totalMessage: 'tổng cộng',
    selectedMessage: 'đã chọn',
    emptyMessage: 'Không có dữ liệu'
  };

  selectedUnits: any[] = [];
  units = [
    { name: 'Kilogram (kg)', code: 'kg' },
    { name: 'Gram (g)', code: 'g' },
    { name: 'Piece (pc)', code: 'pc' },
    { name: 'Box', code: 'box' }
  ]

  newBlog: any = {
    title: '',
    description: '',
    categoryId: null,
    coverImage: '',
    tags: []
  };
  previewCover: any = null;
  isEditMode: any;
  pageSize: any;
  cols: any;

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
}
