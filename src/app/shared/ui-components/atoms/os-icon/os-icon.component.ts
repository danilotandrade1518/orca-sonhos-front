import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export type OsIconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type OsIconVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

@Component({
  selector: 'os-icon',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <mat-icon
      [class]="iconClass()"
      [attr.aria-hidden]="ariaHidden()"
      [attr.aria-label]="ariaLabel() || null"
      [attr.title]="title() || null"
      [fontSet]="fontSet()"
      [fontIcon]="fontIcon()"
      [color]="matColor()"
      [inline]="inline()"
    >
      @if (!fontIcon()) {
      {{ iconContent() }}
      }
    </mat-icon>
  `,
  styleUrls: ['./os-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OsIconComponent {
  name = input<string>('');
  size = input<OsIconSize>('md');
  variant = input<OsIconVariant>('default');
  ariaHidden = input(true);
  ariaLabel = input<string>('');
  title = input<string>('');
  spin = input(false);
  pulse = input(false);
  fontSet = input<string>('');
  fontIcon = input<string>('');
  inline = input(false);
  iconClass = computed(() => {
    return [
      'os-icon',
      `os-icon--${this.size()}`,
      `os-icon--${this.variant()}`,
      this.spin() ? 'os-icon--spin' : '',
      this.pulse() ? 'os-icon--pulse' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  iconContent = computed(() => {
    const iconName = this.name();
    if (!iconName) return '';

    const iconMap: Record<string, string> = {
      home: '🏠',
      menu: '☰',
      close: '✕',
      back: '←',
      forward: '→',
      up: '↑',
      down: '↓',
      left: '←',
      right: '→',
      add: '+',
      remove: '−',
      edit: '✏',
      delete: '🗑',
      save: '💾',
      cancel: '✕',
      confirm: '✓',
      search: '🔍',
      filter: '🔽',
      sort: '⇅',
      refresh: '↻',
      settings: '⚙',
      help: '?',
      info: 'ℹ',
      warning: '⚠',
      error: '❌',
      success: '✅',
      user: '👤',
      users: '👥',
      profile: '👤',
      logout: '↪',
      login: '↩',
      money: '💰',
      wallet: '👛',
      'credit-card': '💳',
      bank: '🏦',
      chart: '📊',
      'trending-up': '📈',
      'trending-down': '📉',
      calculator: '🧮',
      mail: '✉',
      phone: '📞',
      message: '💬',
      notification: '🔔',
      bell: '🔔',
      file: '📄',
      folder: '📁',
      download: '⬇',
      upload: '⬆',
      attachment: '📎',
      calendar: '📅',
      clock: '🕐',
      time: '⏰',
      date: '📅',
      play: '▶',
      pause: '⏸',
      stop: '⏹',
      volume: '🔊',
      mute: '🔇',
      like: '👍',
      dislike: '👎',
      share: '📤',
      star: '⭐',
      heart: '❤',
      loading: '⟳',
      spinner: '⟳',
      check: '✓',
      cross: '✕',
      plus: '+',
      minus: '−',
      'arrow-up': '↑',
      'arrow-down': '↓',
      'arrow-left': '←',
      'arrow-right': '→',
      'chevron-up': '⌃',
      'chevron-down': '⌄',
      'chevron-left': '⌃',
      'chevron-right': '⌄',
      dots: '⋯',
      more: '⋯',
      'menu-dots': '⋯',
    };

    return iconMap[iconName] || iconName;
  });

  // Mapeamento interno para Material
  protected matColor = computed(() => {
    switch (this.variant()) {
      case 'primary':
        return 'primary';
      case 'secondary':
        return 'accent';
      case 'success':
        return 'primary';
      case 'warning':
        return 'warn';
      case 'error':
        return 'warn';
      case 'info':
        return 'accent';
      default:
        return undefined;
    }
  });
}
