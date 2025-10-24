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
export type OsIconRole = 'decorative' | 'informative' | 'interactive';

@Component({
  selector: 'os-icon',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    @if (svgContent()) {
    <div
      [class]="iconClass()"
      [attr.aria-hidden]="ariaHidden()"
      [attr.aria-label]="ariaLabel() || null"
      [attr.title]="title() || null"
      [innerHTML]="svgContent()"
      role="img"
    ></div>
    } @else if (svgUrl()) {
    <img
      [class]="iconClass()"
      [attr.aria-hidden]="ariaHidden()"
      [attr.aria-label]="ariaLabel() || null"
      [attr.title]="title() || null"
      [src]="svgUrl()"
      [alt]="ariaLabel() || ''"
      role="img"
    />
    } @else {
    <mat-icon
      [class]="iconClass()"
      [attr.aria-hidden]="ariaHidden()"
      [attr.aria-label]="ariaLabel() || null"
      [attr.title]="title() || null"
      [fontSet]="fontSet()"
      [fontIcon]="fontIcon()"
      [color]="matColor()"
      [inline]="inline()"
      [attr.role]="iconRole()"
    >
      @if (!fontIcon()) {
      {{ iconContent() }}
      }
    </mat-icon>
    }
  `,
  styleUrls: ['./os-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OsIconComponent {
  name = input<string>('');
  size = input<OsIconSize>('md');
  variant = input<OsIconVariant>('default');
  role = input<OsIconRole>('decorative');
  ariaLabel = input<string>('');
  title = input<string>('');
  spin = input(false);
  pulse = input(false);
  fontSet = input<string>('');
  fontIcon = input<string>('');
  inline = input(false);
  svgContent = input<string>('');
  svgUrl = input<string>('');
  fallbackIcon = input<string>('help');
  // Computed properties para acessibilidade
  ariaHidden = computed(() => {
    return this.role() === 'decorative';
  });

  iconRole = computed(() => {
    switch (this.role()) {
      case 'informative':
        return 'img';
      case 'interactive':
        return 'button';
      default:
        return null;
    }
  });

  iconClass = computed(() => {
    return [
      'os-icon',
      `os-icon--${this.size()}`,
      `os-icon--${this.variant()}`,
      `os-icon--${this.role()}`,
      this.spin() ? 'os-icon--spin' : '',
      this.pulse() ? 'os-icon--pulse' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  // Validação de ícones suportados
  private readonly supportedIcons = new Set([
    'home',
    'menu',
    'close',
    'back',
    'forward',
    'up',
    'down',
    'left',
    'right',
    'add',
    'remove',
    'edit',
    'delete',
    'save',
    'cancel',
    'confirm',
    'search',
    'filter',
    'sort',
    'refresh',
    'settings',
    'help',
    'info',
    'warning',
    'error',
    'success',
    'user',
    'users',
    'profile',
    'logout',
    'login',
    'money',
    'wallet',
    'credit-card',
    'bank',
    'chart',
    'trending-up',
    'trending-down',
    'calculator',
    'mail',
    'phone',
    'message',
    'notification',
    'bell',
    'file',
    'folder',
    'download',
    'upload',
    'attachment',
    'calendar',
    'clock',
    'time',
    'date',
    'play',
    'pause',
    'stop',
    'volume',
    'mute',
    'like',
    'dislike',
    'share',
    'star',
    'heart',
    'loading',
    'spinner',
    'check',
    'cross',
    'plus',
    'minus',
    'arrow-up',
    'arrow-down',
    'arrow-left',
    'arrow-right',
    'chevron-up',
    'chevron-down',
    'chevron-left',
    'chevron-right',
    'dots',
    'more',
    'menu-dots',
  ]);

  iconContent = computed(() => {
    const iconName = this.name();
    if (!iconName) return this.fallbackIcon();

    // Verificar se o ícone é suportado
    if (!this.supportedIcons.has(iconName)) {
      console.warn(`Ícone "${iconName}" não é suportado. Usando fallback "${this.fallbackIcon()}"`);
      return this.getIconContent(this.fallbackIcon());
    }

    return this.getIconContent(iconName);
  });

  private getIconContent(iconName: string): string {
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

    return iconMap[iconName] || this.fallbackIcon();
  }

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
