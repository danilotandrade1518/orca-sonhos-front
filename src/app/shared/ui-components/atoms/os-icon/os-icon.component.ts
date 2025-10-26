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
      [fontIcon]="fontIcon() || iconContent()"
      [color]="matColor()"
      [inline]="inline()"
      [attr.role]="iconRole()"
    >
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
    'eye',
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
    'attach_money',
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
    'calendar_today',
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
    // Ícones adicionais encontrados nos testes
    'category',
    'check_circle',
    'trending_flat',
    'bar_chart',
    'event',
    'update',
    'utensils',
    'trash',
    'money-bill',
    'exchange-alt',
    'folder-open',
    'account_balance_wallet',
    'analytics',
    'people',
    'keyboard_arrow_down',
    'inbox',
    'receipt',
    'celebration',
    'schedule',
    'play_arrow',
    'flag',
    'savings',
    'history',
    'flash_on',
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
      home: 'home',
      menu: 'menu',
      close: 'close',
      back: 'arrow_back',
      forward: 'arrow_forward',
      up: 'keyboard_arrow_up',
      down: 'keyboard_arrow_down',
      left: 'keyboard_arrow_left',
      right: 'keyboard_arrow_right',
      add: 'add',
      remove: 'remove',
      edit: 'edit',
      delete: 'delete',
      save: 'save',
      cancel: 'cancel',
      confirm: 'check',
      search: 'search',
      eye: 'visibility',
      filter: 'filter_list',
      sort: 'sort',
      refresh: 'refresh',
      settings: 'settings',
      help: 'help',
      info: 'info',
      warning: 'warning',
      error: 'error',
      success: 'check_circle',
      user: 'person',
      users: 'people',
      profile: 'account_circle',
      logout: 'logout',
      login: 'login',
      money: 'attach_money',
      attach_money: 'attach_money',
      wallet: 'account_balance_wallet',
      'credit-card': 'credit_card',
      bank: 'account_balance',
      chart: 'bar_chart',
      'trending-up': 'trending_up',
      'trending-down': 'trending_down',
      calculator: 'calculate',
      mail: 'mail',
      phone: 'phone',
      message: 'message',
      notification: 'notifications',
      bell: 'notifications',
      file: 'description',
      folder: 'folder',
      download: 'download',
      upload: 'upload',
      attachment: 'attach_file',
      calendar: 'calendar_today',
      calendar_today: 'calendar_today',
      clock: 'access_time',
      time: 'schedule',
      date: 'event',
      play: 'play_arrow',
      pause: 'pause',
      stop: 'stop',
      volume: 'volume_up',
      mute: 'volume_off',
      like: 'thumb_up',
      dislike: 'thumb_down',
      share: 'share',
      star: 'star',
      heart: 'favorite',
      loading: 'autorenew',
      spinner: 'autorenew',
      check: 'check',
      cross: 'close',
      plus: 'add',
      minus: 'remove',
      'arrow-up': 'keyboard_arrow_up',
      'arrow-down': 'keyboard_arrow_down',
      'arrow-left': 'keyboard_arrow_left',
      'arrow-right': 'keyboard_arrow_right',
      'chevron-up': 'expand_less',
      'chevron-down': 'expand_more',
      'chevron-left': 'chevron_left',
      'chevron-right': 'chevron_right',
      dots: 'more_horiz',
      more: 'more_vert',
      'menu-dots': 'more_vert',
      // Ícones adicionais encontrados nos testes
      category: 'category',
      check_circle: 'check_circle',
      trending_flat: 'trending_flat',
      bar_chart: 'bar_chart',
      event: 'event',
      update: 'update',
      utensils: 'restaurant',
      trash: 'delete',
      'money-bill': 'attach_money',
      'exchange-alt': 'swap_horiz',
      'folder-open': 'folder_open',
      account_balance_wallet: 'account_balance_wallet',
      analytics: 'analytics',
      people: 'people',
      keyboard_arrow_down: 'keyboard_arrow_down',
      inbox: 'inbox',
      receipt: 'receipt',
      celebration: 'celebration',
      schedule: 'schedule',
      play_arrow: 'play_arrow',
      flag: 'flag',
      savings: 'savings',
      history: 'history',
      flash_on: 'flash_on',
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
