import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EditorModule } from 'primeng/editor';
import { FileUploadModule } from 'primeng/fileupload';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { Button } from "primeng/button";
import { CreateUpdateProductDto } from 'src/app/proxy/products';
import { ProductUnit } from 'src/app/proxy/entities/models';
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
    Button
],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss'
})
export class ProductForm {

  @Input() visible = false;
  @Input() isEditMode = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<CreateUpdateProductDto>();

  form: CreateUpdateProductDto = {
    name: '',
    origin: '',
    description: '',
    categoryId: 0,
    coverImage: '',
    units: [] 
  };



  test: any;
  units = [
    { name: 'Kilogram (kg)', code: 'kg' },
    { name: 'Gram (g)', code: 'g' },
    { name: 'Piece (pc)', code: 'pc' },
    { name: 'Box', code: 'box' }
  ];
  categories = [
    { id: 1, name: 'Hải sản' },
    { id: 2, name: 'Nông sản' }
  ];
  selectedUnits: any[] = [];
  previewCover: any = null;
  previewImages: any[] = [];


  onCoverSelect(event: any) {
    const file = event.files[0];
    this.previewCover = URL.createObjectURL(file);
  }
  onImagesSelect(event: any) {
    for (let file of event.files) {
      this.previewImages.push(URL.createObjectURL(file));
    }
  }

  onCancel() {
    this.close.emit();
  }

  buildUnits() {
  this.form.units = this.selectedUnits.map(u => ({
    unitName: u.code,
    price: 0,          // hoặc bind thêm input giá
    stockQuantity: 0,
    isDefault: false
  }));

  // nếu có ít nhất 1 unit → set default
  if (this.form.units.length) {
    this.form.units[0].isDefault = true;
  }
}


  onSave() {
    this.buildUnits();
  this.save.emit(this.form);
  }

  
}
