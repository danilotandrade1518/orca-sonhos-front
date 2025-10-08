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

export type OsCheckboxSize = 'small' | 'medium' | 'large';
export type OsCheckboxVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error';

@Component({
  selector: 'os-checkbox',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="containerClass()">
      <input
        type="checkbox"
        [id]="inputId"
        [checked]="checked()"
        [disabled]="disabled()"
        [indeterminate]="indeterminate()"
        [class]="inputClass()"
        (change)="handleChange($event)"
        (blur)="handleBlur($event)"
        (focus)="handleFocus($event)"
        [attr.aria-describedby]="ariaDescribedBy() || null"
        [attr.aria-label]="ariaLabel() || null"
      />
      <label [for]="inputId" [class]="labelClass()" [attr.aria-hidden]="true">
        <span [class]="checkboxClass()">
          @if (checked() && !indeterminate()) {
          <span class="os-checkbox__checkmark">✓</span>
          } @else if (indeterminate()) {
          <span class="os-checkbox__indeterminate">−</span>
          }
        </span>
        @if (label()) {
        <span class="os-checkbox__label-text">{{ label() }}</span>
        }
      </label>
    </div>
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
  ariaDescribedBy = input<string>('');
  ariaLabel = input<string>('');

  checkboxChange = output<boolean>();
  checkboxBlurEvent = output<FocusEvent>();
  checkboxFocusEvent = output<FocusEvent>();

  protected inputId = `os-checkbox-${Math.random().toString(36).substr(2, 9)}`;
  private onChange = (value: boolean) => {
    // This will be set by registerOnChange
    console.debug('onChange called with:', value);
  };
  private onTouched = () => {
    // This will be set by registerOnTouched
  };

  containerClass = computed(() => {
    return [
      'os-checkbox',
      `os-checkbox--${this.size()}`,
      this.disabled() ? 'os-checkbox--disabled' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  inputClass = computed(() => {
    return ['os-checkbox__input', `os-checkbox__input--${this.variant()}`]
      .filter(Boolean)
      .join(' ');
  });

  labelClass = computed(() => {
    return ['os-checkbox__label', this.disabled() ? 'os-checkbox__label--disabled' : '']
      .filter(Boolean)
      .join(' ');
  });

  checkboxClass = computed(() => {
    return [
      'os-checkbox__box',
      `os-checkbox__box--${this.variant()}`,
      `os-checkbox__box--${this.size()}`,
      this.checked() ? 'os-checkbox__box--checked' : '',
      this.indeterminate() ? 'os-checkbox__box--indeterminate' : '',
      this.disabled() ? 'os-checkbox__box--disabled' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  handleChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const isChecked = target.checked;

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
    // Update the model signal when FormControl value changes programmatically
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
    // Update the disabled state when called by Angular Forms
    this.disabled.set(isDisabled);
  }
}
