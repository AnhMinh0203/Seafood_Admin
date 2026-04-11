import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { AuthService } from '../../shared/services/auth.service';
import { RegisterDto } from '../../shared/models/auth.model';
import { ToastService } from '../../shared/services/toast.service';

interface RegisterForm {
  fullName: string;
  username: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  submitted = false;
  showPassword = false;
  showConfirmPassword = false;
  loading = false;

  form: RegisterForm = {
    fullName: '',
    username: '',
    phone: '',
    password: '',
    confirmPassword: ''
  };

  constructor(
    private authService: AuthService,
    private toast: ToastService,
    private router: Router
  ) {}

  get passwordMismatch(): boolean {
    return !!this.form.password &&
           !!this.form.confirmPassword &&
           this.form.password !== this.form.confirmPassword;
  }

  onSubmit(): void {
    this.submitted = true;

    if (!this.form.fullName.trim()) {
      this.toast.warning('Vui lòng nhập họ và tên.');
      return;
    }

    if (!this.form.phone.trim()) {
      this.toast.warning('Vui lòng nhập số điện thoại.');
      return;
    }

    if (!this.form.username.trim()) {
      this.toast.warning('Vui lòng nhập tên đăng nhập.');
      return;
    }

    if (!this.form.password.trim()) {
      this.toast.warning('Vui lòng nhập mật khẩu.');
      return;
    }

    if (this.form.password.trim().length < 4) {
      this.toast.warning('Mật khẩu phải có ít nhất 4 ký tự.');
      return;
    }

    if (!this.form.confirmPassword.trim()) {
      this.toast.warning('Vui lòng nhập xác nhận mật khẩu.');
      return;
    }

    if (this.passwordMismatch) {
      this.toast.warning('Mật khẩu xác nhận không khớp.');
      return;
    }

    const payload: RegisterDto = {
      userName: this.form.username.trim(),
      password: this.form.password,
      phoneNumber: this.form.phone.trim(),
      fullName: this.form.fullName.trim()
    };

    this.loading = true;

    this.authService.register(payload)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (res) => {
          if (!res.isSuccess) {
            this.toast.error(res.message || 'Đăng ký chưa thành công.');
            return;
          }

          this.toast.success(res.message || 'Đăng ký thành công.');

          this.form = {
            fullName: '',
            username: '',
            phone: '',
            password: '',
            confirmPassword: ''
          };

          this.submitted = false;

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 500);
        },
        error: (err) => {
          console.error('Register failed:', err);

          const message =
            err?.error?.message ||
            err?.error?.error?.message ||
            'Không thể đăng ký lúc này, vui lòng thử lại.';

          this.toast.error(message);
        }
      });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}