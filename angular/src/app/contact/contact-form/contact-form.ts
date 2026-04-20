import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ContactRequestDto } from 'src/app/proxy/contacts/dtos/models';
import { ContactRequestService } from 'src/app/proxy/controllers/contact-request.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-contact-form',
  imports: [
    CommonModule,
    ButtonModule,
    TagModule
  ],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.scss'
})
export class ContactForm {
  @Input() contact!: ContactRequestDto;
  @Output() onUpdated = new EventEmitter<void>();

  private readonly contactService = inject(ContactRequestService);
  private readonly messageService = inject(MessageService);

  statusLabel = '';


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['contact'] && this.contact) {
      this.statusLabel = this.contact.status === 1 ? 'Đã xử lý' : 'Chờ xử lý';
      console.log("Contact changed: ", this.contact);
    }
  }
  approve(): void {
    this.updateStatus(1);
  }

  reject(): void {
    this.updateStatus(0);
  }

  private updateStatus(status: number): void {
    // this.contactService.updateStatus(this.contact.id, status).subscribe({
    //   next: () => {
    //     this.messageService.add({
    //       severity: 'success',
    //       summary: 'Thành công',
    //       detail: 'Cập nhật trạng thái thành công'
    //     });
    //     this.onUpdated.emit();
    //   },
    //   error: () => {
    //     this.messageService.add({
    //       severity: 'error',
    //       summary: 'Lỗi',
    //       detail: 'Cập nhật thất bại'
    //     });
    //   }
    // });
  }

  // mapping giống component cha
  getStatusLabel(status: number): string {
    console.log("Status: ", status);
    return status == 1 ? 'Đã xử lý' : 'Chờ xử lý';
  }
}
