import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OsIconComponent } from '../../atoms/os-icon/os-icon.component';
import { OsButtonComponent } from '../../atoms/os-button/os-button.component';

export type OsEmptyStateSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'os-empty-state',
  standalone: true,
  imports: [CommonModule, OsIconComponent, OsButtonComponent],
  template: `
    <div
      class="os-empty-state"
      [class]="emptyStateClasses()"
      role="status"
      [attr.aria-live]="ariaLive()"
      [attr.aria-label]="ariaLabel()"
    >
      @if (icon()) {
      <div class="os-empty-state__icon" [attr.aria-hidden]="'true'">
        <os-icon [name]="icon()" [size]="iconSize()" [variant]="iconVariant()" />
      </div>
      }

      @if (title()) {
      <h3 class="os-empty-state__title">{{ title() }}</h3>
      }

      @if (message()) {
      <p class="os-empty-state__message">{{ message() }}</p>
      }

      @if (showAction()) {
      <div class="os-empty-state__action">
        <os-button
          [variant]="actionVariant()"
          [size]="actionSize()"
          [icon]="actionIcon()"
          (buttonClick)="onActionClick()"
          [attr.aria-label]="actionLabel()"
        >
          {{ actionLabel() }}
        </os-button>
      </div>
      }

      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./os-empty-state.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'os-empty-state-host',
  },
})
export class OsEmptyStateComponent {
  size = input<OsEmptyStateSize>('medium');
  icon = input<string | null>(null);
  title = input<string | null>(null);
  message = input<string | null>(null);
  showAction = input(false);
  actionLabel = input('Adicionar');
  actionIcon = input<string>('plus');
  actionVariant = input<'primary' | 'secondary' | 'tertiary'>('primary');
  actionSize = input<'small' | 'medium' | 'large'>('medium');
  ariaLabel = input<string | null>(null);
  ariaLive = input<'polite' | 'assertive' | 'off'>('polite');

  actionClick = output<void>();

  emptyStateClasses = computed(() => {
    const classes = ['os-empty-state'];
    if (this.size() !== 'medium') {
      classes.push(`os-empty-state--${this.size()}`);
    }
    return classes.join(' ');
  });

  iconSize = computed(() => {
    const sizeMap: Record<OsEmptyStateSize, 'sm' | 'md' | 'lg'> = {
      small: 'sm',
      medium: 'md',
      large: 'lg',
    };
    return sizeMap[this.size()];
  });

  iconVariant = computed(() => {
    return 'default';
  });

  onActionClick(): void {
    this.actionClick.emit();
  }
}

