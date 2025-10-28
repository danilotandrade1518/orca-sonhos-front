import {
  Component,
  input,
  output,
  computed,
  model,
  ChangeDetectionStrategy,
  forwardRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';

export type OsCheckboxSize = 'small' | 'medium' | 'large';
export type OsCheckboxVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error';
export type OsCheckboxRole = 'checkbox' | 'switch';

@Component({
  selector: 'os-checkbox',
  standalone: true,
  imports: [CommonModule, MatCheckboxModule],
  template: `
    <mat-checkbox
      [id]="inputId"
      [checked]="checked()"
      [disabled]="disabled()"
      [indeterminate]="indeterminate()"
      [color]="matColor()"
      [class]="checkboxClass()"
      (change)="handleChange($event)"
      (blur)="handleBlur($event)"
      (focus)="handleFocus($event)"
      [attr.aria-describedby]="ariaDescribedBy() || null"
      [attr.aria-label]="ariaLabel() || null"
      [attr.aria-labelledby]="ariaLabelledBy() || null"
      [attr.aria-checked]="ariaChecked()"
      [attr.role]="checkboxRole()"
      [attr.data-animated]="animated()"
    >
      @if (label()) {
      {{ label() }}
      }
    </mat-checkbox>
  `,
  styleUrls: ['./os-checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OsCheckboxComponent),
      multi: true,
    },
  ],
})
export class OsCheckboxComponent implements ControlValueAccessor {
  size = input<OsCheckboxSize>('medium');
  variant = input<OsCheckboxVariant>('default');
  label = input<string>('');
  checked = model(false);
  disabled = model(false);
  indeterminate = input(false);
  required = input(false);
  animated = input(true);
  role = input<OsCheckboxRole>('checkbox');
  ariaDescribedBy = input<string>('');
  ariaLabel = input<string>('');
  ariaLabelledBy = input<string>('');

  checkboxChange = output<boolean>();
  checkboxBlurEvent = output<FocusEvent>();
  checkboxFocusEvent = output<FocusEvent>();

  protected inputId = `os-checkbox-${Math.random().toString(36).substr(2, 9)}`;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private onChange = (value: boolean) => {};
  private onTouched = () => {};

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
      default:
        return undefined;
    }
  });

  checkboxClass = computed(() => {
    return [
      'os-checkbox',
      `os-checkbox--${this.size()}`,
      `os-checkbox--${this.variant()}`,
      this.disabled() ? 'os-checkbox--disabled' : '',
      this.checked() ? 'os-checkbox--checked' : '',
      this.indeterminate() ? 'os-checkbox--indeterminate' : '',
      this.animated() ? 'os-checkbox--animated' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  ariaChecked = computed(() => {
    if (this.indeterminate()) return 'mixed';
    return this.checked() ? 'true' : 'false';
  });

  checkboxRole = computed(() => {
    return this.role();
  });

  handleChange(event: { checked: boolean }): void {
    const isChecked = event.checked;

    this.onChange(isChecked);
    this.checkboxChange.emit(isChecked);
  }

  handleBlur(event: FocusEvent): void {
    this.onTouched();
    this.checkboxBlurEvent.emit(event);
  }

  handleFocus(event: FocusEvent): void {
    this.checkboxFocusEvent.emit(event);
  }

  writeValue(value: boolean): void {
    if (value !== this.checked()) {
      this.checked.set(value);
    }
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
