import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ToastItem, ToastType } from '../models/toast.model';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private readonly _toasts = new BehaviorSubject<ToastItem[]>([]);
  readonly toasts$ = this._toasts.asObservable();

  private seed = 0;

  show(type: ToastType, message: string, title?: string, duration = 3000): void {
    const toast: ToastItem = {
      id: ++this.seed,
      type,
      message,
      title,
      duration
    };

    const current = this._toasts.value;
    this._toasts.next([...current, toast]);

    setTimeout(() => {
      this.remove(toast.id);
    }, duration);
  }

  success(message: string, title = 'Thành công', duration = 3000): void {
    this.show('success', message, title, duration);
  }

  error(message: string, title = 'Có lỗi xảy ra', duration = 3500): void {
    this.show('error', message, title, duration);
  }

  warning(message: string, title = 'Lưu ý', duration = 3000): void {
    this.show('warning', message, title, duration);
  }

  info(message: string, title = 'Thông báo', duration = 3000): void {
    this.show('info', message, title, duration);
  }

  remove(id: number): void {
    this._toasts.next(this._toasts.value.filter(x => x.id !== id));
  }

  clear(): void {
    this._toasts.next([]);
  }
}