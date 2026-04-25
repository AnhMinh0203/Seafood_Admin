import { Injectable, signal } from '@angular/core';
export type UserSidebarMode = 'top-bar' | 'header';

@Injectable({
  providedIn: 'root'
})
export class UserSidebarService {
  private readonly _isOpen = signal(false);
  private readonly _mode = signal<UserSidebarMode>('top-bar');

  readonly isOpen = this._isOpen.asReadonly();
  readonly mode = this._mode.asReadonly();

  open(mode: UserSidebarMode = 'top-bar'): void {
    this._mode.set(mode);
    this._isOpen.set(true);
  }

  close(): void {
    this._isOpen.set(false);
  }

  toggle(mode: UserSidebarMode = 'top-bar'): void {
    this._mode.set(mode);
    this._isOpen.update(value => !value);
  }
}