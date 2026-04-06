import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';

interface RegisterForm {
  fullName: string;
  username: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
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
    agreeTerms: false
  };

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
      !this.form.agreeTerms ||
      this.passwordMismatch
    ) {
      return;
    }

    console.log('Register form:', this.form);

    alert('Đăng ký thành công!');

    this.form = {
      fullName: '',
      username: '',
      phone: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false
    };

    this.submitted = false;
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}