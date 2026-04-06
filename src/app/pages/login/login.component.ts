import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';

interface LoginForm {
  username: string;
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

  form: LoginForm = {
    username: '',
    password: '',
    rememberMe: false
  };

  onSubmit(): void {
    this.submitted = true;

    if (!this.form.username.trim() || !this.form.password.trim()) {
      return;
    }

    console.log('Login form:', this.form);

    alert('Đăng nhập thành công!');

    this.form = {
      username: '',
      password: '',
      rememberMe: false
    };

    this.submitted = false;
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}