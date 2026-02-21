

import { Component } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { Menu, MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
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

@Component({
  selector: 'app-unit',
  imports: [
    DialogModule,
    DatatableComponent,
    DataTableColumnDirective,
    DataTableColumnHeaderDirective,
    DataTableColumnCellDirective,

    ButtonModule,

    Menu, MenuModule,
    InputGroupModule,
    InputGroupAddonModule,
    FormsModule,
    IftaLabelModule,
    InputTextModule,
    FileUploadModule,
    EditorModule,
    MultiSelectModule
  ],
  templateUrl: './blog.html',
  styleUrl: './blog.scss'
})
export class Blog {
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
}
