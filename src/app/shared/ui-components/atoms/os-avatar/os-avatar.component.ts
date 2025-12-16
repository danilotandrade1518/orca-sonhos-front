import { Component, input, computed, ChangeDetectionStrategy, signal } from '@angular/core';

import { OsIconComponent } from '../os-icon/os-icon.component';
import { OsBadgeComponent } from '../os-badge/os-badge.component';

export type OsAvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type OsAvatarVariant = 'circle' | 'square' | 'rounded';
export type OsAvatarStatus = 'online' | 'offline' | 'away' | 'busy' | 'invisible';
export type OsAvatarRole = 'img' | 'button' | 'presentation';

@Component({
  selector: 'os-avatar',
  standalone: true,
  imports: [OsIconComponent, OsBadgeComponent],
  template: `
    <div
      [class]="avatarClass()"
      [attr.aria-label]="ariaLabel() || null"
      [attr.title]="title() || null"
      [attr.role]="avatarRole()"
      [attr.tabindex]="clickable() ? '0' : null"
      (click)="handleClick()"
      (keydown.enter)="handleClick()"
      (keydown.space)="handleClick()"
    >
      @if (loading()) {
      <div class="os-avatar__skeleton" [class]="skeletonClass()"></div>
      } @else if (images() && images().length > 0 && !this._imageError) {
      <div class="os-avatar__image-container" [class]="imageContainerClass()">
        @for (img of images(); track img; let i = $index) { @if (i === currentImageIndex()) {
        <img
          [src]="img"
          [alt]="alt() || 'Avatar'"
          [class]="imageClass()"
          (error)="handleImageError()"
          (load)="handleImageLoad()"
        />
        } } @if (images().length > 1) {
        <button
          class="os-avatar__image-nav os-avatar__image-nav--prev"
          (click)="previousImage($event)"
          [attr.aria-label]="'Imagem anterior'"
          type="button"
        >
          <os-icon name="chevron-left" size="sm" [ariaHidden]="true" />
        </button>
        <button
          class="os-avatar__image-nav os-avatar__image-nav--next"
          (click)="nextImage($event)"
          [attr.aria-label]="'Próxima imagem'"
          type="button"
        >
          <os-icon name="chevron-right" size="sm" [ariaHidden]="true" />
        </button>
        }
      </div>
      } @else if (image() && !this._imageError) {
      <img
        [src]="image()"
        [alt]="alt() || 'Avatar'"
        [class]="imageClass()"
        (error)="handleImageError()"
        (load)="handleImageLoad()"
      />
      } @else if (initials() && !image()) {
      <span [class]="initialsClass()">{{ optimizedInitials() }}</span>
      } @else {
      <os-icon name="user" [size]="iconSize()" variant="default" [ariaHidden]="true" />
      } @if (status() && status() !== 'invisible') {
      <div
        class="os-avatar__status"
        [class]="statusClass()"
        [attr.aria-label]="statusLabel()"
      ></div>
      } @if (badge() && badgeText()) {
      <os-badge
        [text]="badgeText()"
        [variant]="badgeVariant()"
        [size]="badgeSize()"
        [position]="'top-right'"
      />
      }
    </div>
  `,
  styleUrls: ['./os-avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OsAvatarComponent {
  image = input<string>('');
  images = input<string[]>([]);
  initials = input<string>('');
  alt = input<string>('');
  size = input<OsAvatarSize>('md');
  variant = input<OsAvatarVariant>('circle');
  status = input<OsAvatarStatus>('offline');
  role = input<OsAvatarRole>('img');
  loading = input(false);
  clickable = input(false);
  ariaLabel = input<string>('');
  title = input<string>('');
  badge = input(false);
  badgeText = input<string>('');
  badgeVariant = input<
    'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  >('default');

  protected _imageError = false;
  protected _currentImageIndex = signal(0);
  avatarClass = computed(() => {
    return [
      'os-avatar',
      `os-avatar--${this.size()}`,
      `os-avatar--${this.variant()}`,
      this.badge() ? 'os-avatar--with-badge' : '',
      this.status() ? `os-avatar--status-${this.status()}` : '',
      this.loading() ? 'os-avatar--loading' : '',
      this.clickable() ? 'os-avatar--clickable' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  imageClass = computed(() => {
    return ['os-avatar__image', `os-avatar__image--${this.variant()}`].filter(Boolean).join(' ');
  });

  initialsClass = computed(() => {
    return ['os-avatar__initials', `os-avatar__initials--${this.size()}`].filter(Boolean).join(' ');
  });

  iconSize = computed(() => {
    const sizeMap: Record<OsAvatarSize, 'sm' | 'md' | 'lg' | 'xl'> = {
      xs: 'sm',
      sm: 'sm',
      md: 'md',
      lg: 'lg',
      xl: 'xl',
      '2xl': 'xl',
    };
    return sizeMap[this.size()];
  });

  badgeSize = computed(() => {
    const sizeMap: Record<OsAvatarSize, 'sm' | 'md' | 'lg'> = {
      xs: 'sm',
      sm: 'sm',
      md: 'sm',
      lg: 'md',
      xl: 'md',
      '2xl': 'lg',
    };
    return sizeMap[this.size()];
  });

  currentImageIndex = computed(() => this._currentImageIndex());

  optimizedInitials = computed(() => {
    const initials = this.initials();
    if (!initials) return '';
    
    const words = initials.trim().split(/\s+/);
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    return words
      .map((word) => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  });

  avatarRole = computed(() => {
    if (this.clickable()) return 'button';
    return this.role();
  });

  skeletonClass = computed(() => {
    return `os-avatar__skeleton--${this.size()}`;
  });

  imageContainerClass = computed(() => {
    return `os-avatar__image-container--${this.variant()}`;
  });

  statusClass = computed(() => {
    return `os-avatar__status--${this.status()}`;
  });

  statusLabel = computed(() => {
    const statusLabels: Record<OsAvatarStatus, string> = {
      online: 'Online',
      offline: 'Offline',
      away: 'Ausente',
      busy: 'Ocupado',
      invisible: 'Invisível',
    };
    return statusLabels[this.status()];
  });

  handleImageError(): void {
    this._imageError = true;
  }

  handleImageLoad(): void {
    this._imageError = false;
  }

  handleClick(): void {
    
  }

  previousImage(event: Event): void {
    event.stopPropagation();
    const images = this.images();
    if (images.length > 1) {
      const current = this._currentImageIndex();
      const previous = current === 0 ? images.length - 1 : current - 1;
      this._currentImageIndex.set(previous);
    }
  }

  nextImage(event: Event): void {
    event.stopPropagation();
    const images = this.images();
    if (images.length > 1) {
      const current = this._currentImageIndex();
      const next = current === images.length - 1 ? 0 : current + 1;
      this._currentImageIndex.set(next);
    }
  }
}
