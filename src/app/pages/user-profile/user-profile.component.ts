import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface UserProfile {
  fullName: string;
  phoneNumber: string;
  address: string;
}

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {
  private readonly storageKey = 'seafood_user_profile';
  
  profile: UserProfile = {
    fullName: 'Nguyễn Văn Minh',
    phoneNumber: '0901234567',
    address: '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh'
  };

  saveSuccess = false;

  constructor() {
    this.loadProfile();
  }

  loadProfile(): void {
    const rawData = localStorage.getItem(this.storageKey);

    if (rawData) {
      this.profile = JSON.parse(rawData) as UserProfile;
    }
  }

  saveProfile(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.profile));
    this.saveSuccess = true;

    setTimeout(() => {
      this.saveSuccess = false;
    }, 2000);
  }

  clearProfile(): void {
    this.profile = {
      fullName: '',
      phoneNumber: '',
      address: ''
    };

    localStorage.removeItem(this.storageKey);
    this.saveSuccess = false;
  }
}