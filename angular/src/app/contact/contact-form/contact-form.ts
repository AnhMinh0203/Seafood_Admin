import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

import { ContactRequestDto } from 'src/app/proxy/contacts/dtos/models';
import { ContactRequestService } from 'src/app/proxy/controllers/contact-request.service';
interface SelectOption {
  label: string;
  value: number;
}
@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    TagModule
  ],
  templateUrl: './contact-form.html',
  styleUrls: ['./contact-form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactForm implements OnChanges {
  @Input() contact!: ContactRequestDto;
  @Output() onUpdated = new EventEmitter<void>();

  private readonly contactService = inject(ContactRequestService);
  private readonly messageService = inject(MessageService);

  statusLabel = '';
  statusSeverity: 'warn' | 'success' | 'secondary' = 'secondary';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['contact'] && this.contact) {
      this.statusLabel = this.getStatusLabel(this.contact.status);
      this.statusSeverity = this.getStatusSeverity(this.contact.status);

      console.log('Contact changed:', this.contact);
    }
  }

  approve(): void {
    this.updateStatus(1);
  }

  reject(): void {
    this.updateStatus(0);
  }

  private updateStatus(status: number): void {
    if (!this.contact?.id) return;

    this.contactService.updateStatus(this.contact.id, status).subscribe({
      next: (res) => {
        this.statusLabel = status === 1 ? 'Đã xử lý' : 'Chờ xử lý';
        this.statusSeverity = status === 1 ? 'success' : 'warn';

        this.contact = {
          ...this.contact,
          status
        };

        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: res?.message || 'Cập nhật trạng thái thành công'
        });

        this.onUpdated.emit();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Cập nhật thất bại'
        });
      }
    });
  }


  private getStatusLabel(status: number | undefined): string {
    switch (status) {
      case 1:
        return 'Đã xử lý';
      case 0:
        return 'Chờ xử lý';
      default:
        return 'Không xác định';
    }
  }

  private getStatusSeverity(value: number | undefined): 'warn' | 'success' | 'secondary' {
    switch (value) {
      case 0:
        return 'warn';
      case 1:
        return 'success';
      default:
        return 'secondary';
    }
  }

  productOptions: SelectOption[] = [
    { label: 'Combo gà rán', value: 1 },
    { label: 'Burger bò', value: 2 },
    { label: 'Pizza hải sản', value: 3 },
    { label: 'Mì Ý sốt kem', value: 4 },
    { label: 'Cá hồi nướng', value: 5 },
    { label: 'Khác', value: 6 }
  ];

  inquiryTypes: SelectOption[] = [
    { label: 'Tư vấn sản phẩm', value: 1 },
    { label: 'Đặt hàng số lượng lớn', value: 2 },
    { label: 'Hợp tác / đại lý', value: 3 },
    { label: 'Khiếu nại / hỗ trợ', value: 4 },
    { label: 'Góp ý dịch vụ', value: 5 }
  ];

   getProductLabel(value: number | null | undefined): string {
    if (value == null) return '';
    return this.productOptions.find(x => x.value === value)?.label || '';
  }

  getInquiryTypeLabel(value: number | null | undefined): string {
    if (value == null) return '';
    return this.inquiryTypes.find(x => x.value === value)?.label || '';
  }

}