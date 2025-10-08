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

export type OsDateInputSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'os-date-input',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="containerClass()">
      @if (label()) {
      <label [for]="inputId" [class]="labelClass()">
        {{ label() }}
        @if (required()) {
        <span class="os-date-input__required" aria-label="required">*</span>
        }
      </label>
      }

      <div [class]="inputWrapperClass()">
        @if (prefixIcon()) {
        <span class="os-date-input__prefix-icon" [attr.aria-hidden]="true">
          {{ prefixIcon() }}
        </span>
        }

        <input
          [id]="inputId"
          type="date"
          [placeholder]="placeholder()"
          [disabled]="disabled()"
          [readonly]="readonly()"
          [required]="required()"
          [value]="displayValue()"
          [min]="minDate()"
          [max]="maxDate()"
          [class]="inputClass()"
          (input)="handleInput($event)"
          (blur)="handleBlur($event)"
          (focus)="handleFocus($event)"
          [attr.aria-describedby]="helperText() ? inputId + '-helper' : null"
          [attr.aria-invalid]="hasError()"
        />

        @if (suffixIcon()) {
        <span class="os-date-input__suffix-icon" [attr.aria-hidden]="true">
          {{ suffixIcon() }}
        </span>
        }
      </div>

      @if (helperText() || hasError()) {
      <div [id]="inputId + '-helper'" [class]="helperClass()">
        {{ errorMessage() || helperText() }}
      </div>
      }
    </div>
  `,
  styleUrls: ['./os-date-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OsDateInputComponent),
      multi: true,
    },
  ],
})
export class OsDateInputComponent implements ControlValueAccessor {
  size = input<OsDateInputSize>('medium');
  label = input<string>('');
  placeholder = input<string>('');
  helperText = input<string>('');
  errorMessage = input<string>('');
  disabled = input(false);
  readonly = input(false);
  required = input(false);
  prefixIcon = input<string>('');
  suffixIcon = input<string>('');
  value = input<Date | null>(null);
  minDate = input<string>('');
  maxDate = input<string>('');

  valueChange = output<Date | null>();
  blur = output<FocusEvent>();
  focus = output<FocusEvent>();

  private _onChange = (value: Date | null) => {};
  private _onTouched = () => {};

  inputId = `os-date-input-${Math.random().toString(36).substr(2, 9)}`;

  containerClass = computed(() => {
    return [
      'os-date-input-container',
      `os-date-input-container--${this.size()}`,
      this.hasError() ? 'os-date-input-container--error' : '',
      this.disabled() ? 'os-date-input-container--disabled' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  labelClass = computed(() => {
    return ['os-date-input__label', this.required() ? 'os-date-input__label--required' : '']
      .filter(Boolean)
      .join(' ');
  });

  inputWrapperClass = computed(() => {
    return [
      'os-date-input__wrapper',
      this.prefixIcon() ? 'os-date-input__wrapper--with-prefix' : '',
      this.suffixIcon() ? 'os-date-input__wrapper--with-suffix' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  inputClass = computed(() => {
    return [
      'os-date-input',
      `os-date-input--${this.size()}`,
      this.hasError() ? 'os-date-input--error' : '',
      this.disabled() ? 'os-date-input--disabled' : '',
      this.readonly() ? 'os-date-input--readonly' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  helperClass = computed(() => {
    return ['os-date-input__helper', this.hasError() ? 'os-date-input__helper--error' : '']
      .filter(Boolean)
      .join(' ');
  });

  hasError = computed(() => {
    return !!this.errorMessage();
  });

  displayValue = computed(() => {
    const value = this.value();
    if (!value) return '';
    return this.formatDateForInput(value);
  });

  private formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private parseDateFromInput(value: string): Date | null {
    if (!value) return null;
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  }

  handleInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const dateValue = this.parseDateFromInput(target.value);

    this._onChange(dateValue);
    this.valueChange.emit(dateValue);
  }

  handleBlur(event: FocusEvent): void {
    this._onTouched();
    this.blur.emit(event);
  }

  handleFocus(event: FocusEvent): void {
    this.focus.emit(event);
  }

  writeValue(value: Date | null): void {
    // Value is controlled by input signal
  }

  registerOnChange(fn: (value: Date | null) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {}
}
