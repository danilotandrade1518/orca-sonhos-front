import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OsIconComponent } from '../os-icon/os-icon.component';
import { OsBadgeComponent } from '../os-badge/os-badge.component';

export type OsAvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type OsAvatarVariant = 'circle' | 'square' | 'rounded';

@Component({
  selector: 'os-avatar',
  standalone: true,
  imports: [CommonModule, OsIconComponent, OsBadgeComponent],
  template: `
    <div
      [class]="avatarClass()"
      [attr.aria-label]="ariaLabel() || null"
      [attr.title]="title() || null"
    >
      @if (image() && !this._imageError) {
      <img
        [src]="image()"
        [alt]="alt() || 'Avatar'"
        [class]="imageClass()"
        (error)="handleImageError()"
        (load)="handleImageLoad()"
      />
      } @else if (initials() && !image()) {
      <span [class]="initialsClass()">{{ initials() }}</span>
      } @else {
      <os-icon name="user" [size]="iconSize()" variant="default" [ariaHidden]="true" />
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
  initials = input<string>('');
  alt = input<string>('');
  size = input<OsAvatarSize>('md');
  variant = input<OsAvatarVariant>('circle');
  ariaLabel = input<string>('');
  title = input<string>('');
  badge = input(false);
  badgeText = input<string>('');
  badgeVariant = input<
    'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  >('default');

  protected _imageError = false;
  avatarClass = computed(() => {
    return [
      'os-avatar',
      `os-avatar--${this.size()}`,
      `os-avatar--${this.variant()}`,
      this.badge() ? 'os-avatar--with-badge' : '',
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

  handleImageError(): void {
    this._imageError = true;
  }

  handleImageLoad(): void {
    this._imageError = false;
  }
}
