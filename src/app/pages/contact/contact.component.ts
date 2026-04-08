import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterLink, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';

interface ContactFormModel {
  fullName: string;
  phone: string;
  email: string;
  interestedProduct: string;
  inquiryType: string;
  message: string;
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

  constructor(private router: Router) {

  }

  get isContactPage(): boolean {
    return this.router.url.includes('/contact');
  }

  productOptions: string[] = [
    'Combo gà rán',
    'Burger bò',
    'Pizza hải sản',
    'Mì Ý sốt kem',
    'Cá hồi nướng',
    'Khác'
  ];

  inquiryTypes: string[] = [
    'Tư vấn sản phẩm',
    'Đặt hàng số lượng lớn',
    'Hợp tác / đại lý',
    'Khiếu nại / hỗ trợ',
    'Góp ý dịch vụ'
  ];

  form: ContactFormModel = {
    fullName: '',
    phone: '',
    email: '',
    interestedProduct: '',
    inquiryType: '',
    message: ''
  };

  submitForm(): void {
    this.submitted = true;

    if (
      !this.form.fullName.trim() ||
      !this.form.phone.trim() ||
      !this.form.interestedProduct.trim() ||
      !this.form.inquiryType.trim() ||
      !this.form.message.trim()
    ) {
      return;
    }

    console.log('Contact form:', this.form);

    alert('Gửi liên hệ thành công! Chúng tôi sẽ phản hồi sớm nhất.');

    this.form = {
      fullName: '',
      phone: '',
      email: '',
      interestedProduct: '',
      inquiryType: '',
      message: ''
    };

    this.submitted = false;
  }
}