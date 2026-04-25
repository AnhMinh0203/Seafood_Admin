import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ContactRequestService } from '../../shared/services/contact-request.service';
import { ToastService } from '../../shared/services/toast.service';

interface ContactFormModel {
  fullName: string;
  phone: string;
  interestedProduct: number | null;
  inquiryType: number | null;
  message: string;
}

interface SelectOption {
  label: string;
  value: number;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  submitted = false;
  isSubmitting = false;

  constructor(
    private router: Router,
    private contactRequestService: ContactRequestService,
    private toast: ToastService
  ) {}

  get isContactPage(): boolean {
    return this.router.url.includes('/contact');
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

  form: ContactFormModel = {
    fullName: '',
    phone: '',
    interestedProduct: null,
    inquiryType: null,
    message: ''
  };

  submitForm(): void {
    this.submitted = true;

    if (
      !this.form.fullName.trim() ||
      !this.form.phone.trim() ||
      this.form.interestedProduct === null ||
      this.form.inquiryType === null ||
      !this.form.message.trim()
    ) {
      return;
    }

    this.isSubmitting = true;

    this.contactRequestService.create({
      fullName: this.form.fullName.trim(),
      phone: this.form.phone.trim(),
      interestedProduct: this.form.interestedProduct,
      inquiryType: this.form.inquiryType,
      message: this.form.message.trim()
    }).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.toast.success(res.message);

          this.form = {
            fullName: '',
            phone: '',
            interestedProduct: null,
            inquiryType: null,
            message: ''
          };

          this.submitted = false;
        } else {
          this.toast.error(res.message);
        }

        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('Create contact request error:', err);
        this.toast.error(err?.error?.message || err?.error?.error?.message);
        this.isSubmitting = false;
      }
    });
  }
}