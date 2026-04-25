import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ContactRequestDto } from '../proxy/contacts/dtos';
import { ContactRequestService } from '../proxy/controllers/contact-request.service';
import { DialogModule } from "primeng/dialog";
import { ContactForm } from "./contact-form/contact-form";
import { PermissionDirective, PermissionService } from '@abp/ng.core';

// TODO: thay bằng đường dẫn proxy/service thực tế của bạn


@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ToolbarModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    ToastModule,
    ConfirmDialogModule,
    TagModule,
    DialogModule,
    ContactForm,
    PermissionDirective
  ],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',

  providers: [MessageService, ConfirmationService]
})
export class Contact implements OnInit {
  private readonly contactRequestService = inject(ContactRequestService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly permissionService = inject(PermissionService);

  contacts: ContactRequestDto[] = [];
  selectedContacts: ContactRequestDto[] = [];
  selectedContact: ContactRequestDto | null = null;
  showFormDialog = false;
  pageSize = 10;

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts(): void {
    this.contactRequestService.getList().subscribe({
      next: (res) => {
        this.contacts = res || [];
      },
      error: (err) => {
        console.error(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải danh sách yêu cầu liên hệ'
        });
      }
    });
  }

  deleteContact(contact: ContactRequestDto): void {
    this.confirmationService.confirm({
      message: `Bạn có chắc muốn xóa yêu cầu của "${contact.fullName}"?`,
      header: 'Xác nhận xóa',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xóa',
      rejectLabel: 'Hủy',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.contactRequestService.delete(contact.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Đã xóa yêu cầu liên hệ'
            });

            this.loadContacts();
            this.selectedContacts = this.selectedContacts.filter(x => x.id !== contact.id);
          },
          error: (err) => {
            console.error(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Lỗi',
              detail: err?.error?.error?.message || 'Xóa thất bại'
            });
          }
        });
      }
    });
  }

  deleteBatchContacts(): void {
    if (!this.selectedContacts || !this.selectedContacts.length) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Thông báo',
        detail: 'Vui lòng chọn ít nhất một yêu cầu liên hệ để xóa'
      });
      return;
    }

    this.confirmationService.confirm({
      message: `Bạn có chắc muốn xóa ${this.selectedContacts.length} yêu cầu liên hệ đã chọn?`,
      header: 'Xác nhận xóa',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xóa',
      rejectLabel: 'Hủy',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        const ids = this.selectedContacts
          .map(x => x.id)
          .filter((id): id is string => !!id);

        this.contactRequestService.batchDelete(ids).subscribe({
          next: (res) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: res?.message || 'Đã xóa các yêu cầu liên hệ đã chọn'
            });

            this.selectedContacts = [];
            this.loadContacts();
          },
          error: (err) => {
            console.error(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Lỗi',
              detail: err?.error?.error?.message || err?.error?.message || 'Xóa hàng loạt thất bại'
            });
          }
        });
      }
    });
  }


  getProductLabel(value: number | undefined): string {
    switch (value) {
      case 1:
        return 'Combo Gà Rán';
      case 2:
        return 'Burger Bò';
      case 3:
        return 'Pizza Hải Sản';
      case 4:
        return 'Mì Ý Sốt Kem';
      case 5:
        return 'Cá Hồi Nướng';
      case 6:
        return 'Khác';
      default:
        return '';
    }
  }

  getInquiryTypeLabel(value: number | undefined): string {
    switch (value) {
      case 1:
        return 'Tư vấn sản phẩm';
      case 2:
        return 'Đặt hàng số lượng lớn';
      case 3:
        return 'Hợp tác đại lý';
      case 4:
        return 'Khiếu nại hỗ trợ';
      case 5:
        return 'Góp ý dịch vụ';
      default:
        return '';
    }
  }

  getStatusLabel(value: number | undefined): string {
    switch (value) {
      case 0:
        return 'Chờ xử lý';
      case 1:
        return 'Đã xử lý';
      default:
        return '';
    }
  }

  getStatusSeverity(value: number | undefined): 'warn' | 'success' | 'secondary' {
    switch (value) {
      case 0:
        return 'warn';
      case 1:
        return 'success';
      default:
        return 'secondary';
    }
  }
  viewContact(contact: ContactRequestDto) {
    this.selectedContact = contact;
    this.showFormDialog = true;

  }

  approveBatchContacts(): void {
    if (!this.selectedContacts || !this.selectedContacts.length) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Thông báo',
        detail: 'Vui lòng chọn ít nhất một yêu cầu liên hệ để duyệt'
      });
      return;
    }

    this.confirmationService.confirm({
      message: `Bạn có chắc muốn duyệt ${this.selectedContacts.length} yêu cầu liên hệ đã chọn?`,
      header: 'Xác nhận duyệt',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Duyệt',
      rejectLabel: 'Hủy',
      acceptButtonStyleClass: 'p-button-success',
      accept: () => {
        const ids = this.selectedContacts
          .map(x => x.id)
          .filter((id): id is string => !!id);

        this.contactRequestService.batchApprove(ids).subscribe({
          next: (res) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: res?.message || 'Đã duyệt các yêu cầu liên hệ đã chọn'
            });

            this.selectedContacts = [];
            this.loadContacts();
          },
          error: (err) => {
            console.error(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Lỗi',
              detail: err?.error?.error?.message || err?.error?.message || 'Duyệt hàng loạt thất bại'
            });
          }
        });
      }
    });
  }
}
