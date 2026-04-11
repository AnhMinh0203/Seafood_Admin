import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserProfile } from '../../shared/models/user.model';
import { UserService } from '../../shared/services/user.service';


@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {
  profile: UserProfile = {
    fullName: '',
    phoneNumber: '',
    address: ''
  };

  saveSuccess = false;
  loading = false;
  saving = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;

    this.userService.getMyProfile().subscribe({
      next: (res) => {
        this.loading = false;

        if (res?.data) {
          this.profile = {
            fullName: res.data.fullName ?? '',
            phoneNumber: res.data.phoneNumber ?? '',
            address: res.data.address ?? ''
          };
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Load profile failed', err);
      }
    });
  }

  saveProfile(): void {
    this.saving = true;
    this.saveSuccess = false;

    this.userService.updateMyProfile(this.profile).subscribe({
      next: (res) => {
        this.saving = false;

        if (res?.data) {
          this.profile = {
            fullName: res.data.fullName ?? '',
            phoneNumber: res.data.phoneNumber ?? '',
            address: res.data.address ?? ''
          };
        }

        this.saveSuccess = true;

        setTimeout(() => {
          this.saveSuccess = false;
        }, 2000);
      },
      error: (err) => {
        this.saving = false;
        console.error('Update profile failed', err);
      }
    });
  }

  clearProfile(): void {
    this.profile = {
      fullName: '',
      phoneNumber: '',
      address: ''
    };

    this.saveSuccess = false;
  }
}