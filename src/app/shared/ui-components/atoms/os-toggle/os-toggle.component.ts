import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

export type OsToggleSize = 'small' | 'medium' | 'large';
export type OsToggleVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
export type OsToggleRole = 'switch' | 'checkbox';

@Component({
  selector: 'os-toggle',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSlideToggleModule],
  template: `
    <div
      [class]="toggleClasses()"
      [attr.data-size]="size()"
      [attr.data-variant]="variant()"
      [attr.data-animated]="animated()"
      [attr.data-checked]="checked()"
      [attr.data-disabled]="disabled()"
    >
      <mat-slide-toggle
        [id]="id()"
        [name]="name()"
        [disabled]="disabled()"
        [checked]="checked()"
        [color]="matColor()"
        [class]="'os-toggle__input'"
        [attr.aria-label]="ariaLabel()"
        [attr.aria-describedby]="ariaDescribedBy()"
        [attr.aria-required]="required()"
        [attr.role]="toggleRole()"
        [attr.tabindex]="disabled() ? -1 : 0"
        (change)="onToggle($event)"
        (focus)="onFocus()"
        (blur)="onBlur()"
      >
        @if (label()) {
        <span class="os-toggle__label-text">{{ label() }}</span>
        }
      </mat-slide-toggle>

      @if (description()) {
      <div class="os-toggle__description" [id]="descriptionId()">
        {{ description() }}
      </div>
      }
    </div>
  `,
  styleUrls: ['./os-toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OsToggleComponent {
  readonly id = input<string>(`toggle-${Math.random().toString(36).substr(2, 9)}`);
  readonly name = input<string>('');
  readonly label = input<string | null>(null);
  readonly description = input<string | null>(null);
  readonly checked = input(false);
  readonly disabled = input(false);
  readonly required = input(false);
  readonly size = input<OsToggleSize>('medium');
  readonly variant = input<OsToggleVariant>('primary');
  readonly role = input<OsToggleRole>('switch');
  readonly animated = input(true);
  readonly ariaLabel = input<string | null>(null);
  readonly ariaDescribedBy = input<string | null>(null);

  readonly toggled = output<boolean>();
  readonly focused = output<boolean>();
  readonly blurred = output<boolean>();

  // Computed properties para acessibilidade
  readonly toggleRole = computed(() => this.role());
  readonly descriptionId = computed(() => (this.description() ? `${this.id()}-description` : null));

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
      case 'danger':
        return 'warn';
      default:
        return undefined;
    }
  });

  readonly toggleClasses = computed(() => {
    const classes = ['os-toggle'];
    classes.push(`os-toggle--${this.size()}`);
    classes.push(`os-toggle--${this.variant()}`);

    if (this.disabled()) {
      classes.push('os-toggle--disabled');
    }

    if (this.checked()) {
      classes.push('os-toggle--checked');
    }

    if (this.animated()) {
      classes.push('os-toggle--animated');
    }

    return classes.join(' ');
  });

  onToggle(event: { checked: boolean }): void {
    if (!this.disabled()) {
      this.toggled.emit(event.checked);
    }
  }

  onFocus(): void {
    if (!this.disabled()) {
      this.focused.emit(true);
    }
  }

  onBlur(): void {
    this.blurred.emit(true);
  }
}
