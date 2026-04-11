import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../shared/services/auth.service';
import { LoginDto } from '../../shared/models/auth.model';
import { ToastService } from '../../shared/services/toast.service';


interface LoginForm {
  userNameOrPhoneNumber: string;
  password: string;
  rememberMe: boolean;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  submitted = false;
  showPassword = false;
  loading = false;

  form: LoginForm = {
    userNameOrPhoneNumber: '',
    password: '',
    rememberMe: false
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) { }

  onSubmit(): void {
    this.submitted = true;

    if (!this.form.userNameOrPhoneNumber.trim()) {
      this.toast.warning('Vui lòng nhập tên đăng nhập hoặc số điện thoại.');
      return;
    }

    if (!this.form.password.trim()) {
      this.toast.warning('Vui lòng nhập mật khẩu.');
      return;
    }

    const payload: LoginDto = {
      userNameOrPhoneNumber: this.form.userNameOrPhoneNumber.trim(),
      password: this.form.password,
      rememberMe: this.form.rememberMe
    };

    this.loading = true;

    this.authService.login(payload)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (res) => {
          if (!res.isSuccess) {
            this.toast.error(res.message || 'Đăng nhập chưa thành công.');
            return;
          }

          this.toast.success(res.message || 'Đăng nhập thành công.');

          this.form = {
            userNameOrPhoneNumber: '',
            password: '',
            rememberMe: false
          };

          this.submitted = false;

          setTimeout(() => {
            this.router.navigate(['/']);
          }, 300);
        },
        error: (err) => {
          const message =
            err?.error?.message ||
            err?.error?.error?.message ||
            'Không thể đăng nhập lúc này, vui lòng thử lại.';

          this.toast.error(message);
        }
      });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}