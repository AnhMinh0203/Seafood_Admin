import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Dialog } from "primeng/dialog";
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-blog-preview',
  imports: [CommonModule, DialogModule],

  templateUrl: './blog-preview.html',
  styleUrl: './blog-preview.scss'
})
export class BlogPreview {
  @Input() blog: any;
  @Input() visible = false;
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
