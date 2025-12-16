import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { OsIconComponent } from '../os-icon/os-icon.component';

export type OsIconButtonSize = 'small' | 'medium';
export type OsIconButtonVariant = 'default' | 'primary' | 'secondary' | 'danger';

@Component({
  selector: 'os-icon-button',
  standalone: true,
  imports: [OsIconComponent],
  template: `
    <button
      type="button"
      [disabled]="disabled()"
      [class]="buttonClass()"
      [attr.aria-label]="ariaLabel()"
      (click)="onClick()"
      (keydown.enter)="onClick()"
      (keydown.space)="onClick()"
    >
      <os-icon [name]="icon()" [size]="iconSize()" [ariaHidden]="true" />
      <span class="os-icon-button__sr-only">{{ ariaLabel() }}</span>
    </button>
  `,
  styleUrls: ['./os-icon-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'os-icon-button-host',
  },
})
export class OsIconButtonComponent {
  readonly icon = input.required<string>();
  readonly ariaLabel = input<string>('Botão');
  readonly size = input<OsIconButtonSize>('medium');
  readonly variant = input<OsIconButtonVariant>('default');
  readonly disabled = input<boolean>(false);

  readonly clicked = output<void>();

  buttonClass = computed(() => {
    const classes = ['os-icon-button', `os-icon-button--${this.size()}`];
    if (this.variant() !== 'default') {
      classes.push(`os-icon-button--${this.variant()}`);
    }
    if (this.disabled()) {
      classes.push('os-icon-button--disabled');
    }
    return classes.join(' ');
  });

  iconSize = computed(() => {
    return this.size() === 'small' ? 'sm' : 'md';
  });

  onClick(): void {
    if (!this.disabled()) {
      this.clicked.emit();
    }
  }
}
