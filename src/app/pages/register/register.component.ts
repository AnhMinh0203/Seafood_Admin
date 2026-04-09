import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

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

  form: RegisterForm = {
    fullName: '',
    username: '',
    phone: '',
    password: '',
    confirmPassword: '',
  };

  constructor(private authService: AuthService) { }

  get passwordMismatch(): boolean {
    return !!this.form.password && !!this.form.confirmPassword && this.form.password !== this.form.confirmPassword;
  }

  onSubmit(): void {
    this.submitted = true;

    if (
      !this.form.fullName.trim() ||
      !this.form.username.trim() ||
      !this.form.phone.trim() ||
      !this.form.password.trim() ||
      !this.form.confirmPassword.trim() ||
      this.passwordMismatch
    ) {
      return;
    }

    const payload: any = {
      userName: this.form.username || '',
      password: this.form.password || '',
      phoneNumber: this.form.phone || '',
      fullName: this.form.fullName || ''
    };

    this.authService.register(payload).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          alert('Đăng ký thành công!');

          // reset form
          this.form = {
            fullName: '',
            username: '',
            phone: '',
            password: '',
            confirmPassword: '',
          };

          this.submitted = false;
        } else {
          alert(res.message);
        }
      },
      error: (err) => {
        console.error(err);
        alert('Có lỗi xảy ra!');
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
