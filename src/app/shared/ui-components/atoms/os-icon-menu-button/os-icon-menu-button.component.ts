import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { OsIconComponent } from '../os-icon/os-icon.component';

export type OsIconMenuButtonSize = 'small' | 'medium';
export type OsIconMenuButtonVariant = 'default' | 'primary' | 'secondary' | 'danger';

@Component({
  selector: 'os-icon-menu-button',
  standalone: true,
  imports: [CommonModule, MatMenuModule, OsIconComponent],
  template: `
    <button
      type="button"
      [disabled]="disabled()"
      [class]="buttonClass()"
      [attr.aria-label]="ariaLabel()"
      [matMenuTriggerFor]="menu()"
    >
      <os-icon [name]="icon()" [size]="iconSize()" [ariaHidden]="true" />
      <span class="os-icon-menu-button__sr-only">{{ ariaLabel() }}</span>
    </button>
  `,
  styleUrls: ['./os-icon-menu-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'os-icon-menu-button-host',
  },
})
export class OsIconMenuButtonComponent {
  readonly icon = input.required<string>();
  readonly ariaLabel = input<string>('Abrir menu');
  readonly size = input<OsIconMenuButtonSize>('medium');
  readonly variant = input<OsIconMenuButtonVariant>('default');
  readonly disabled = input<boolean>(false);
  readonly menu = input.required<MatMenu>();

  readonly opened = output<void>();
  readonly closed = output<void>();

  buttonClass = computed(() => {
    const classes = ['os-icon-menu-button', `os-icon-menu-button--${this.size()}`];
    if (this.variant() !== 'default') {
      classes.push(`os-icon-menu-button--${this.variant()}`);
    }
    if (this.disabled()) {
      classes.push('os-icon-menu-button--disabled');
    }
    return classes.join(' ');
  });

  iconSize = computed(() => {
    return this.size() === 'small' ? 'sm' : 'md';
  });
}
