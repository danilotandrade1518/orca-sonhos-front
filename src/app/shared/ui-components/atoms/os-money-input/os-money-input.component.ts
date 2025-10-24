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
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule, MatFormFieldAppearance } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

export type OsMoneyInputSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'os-money-input',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatFormFieldModule, MatIconModule],
  template: `
    <div [class]="containerClass()">
      <mat-form-field [appearance]="appearance()" [class]="formFieldClass()">
        @if (label()) {
        <mat-label>{{ label() }}</mat-label>
        }

        <mat-icon matPrefix class="os-money-input__currency-icon">attach_money</mat-icon>

        <input
          matInput
          [id]="inputId"
          type="text"
          [placeholder]="placeholder()"
          [disabled]="disabled()"
          [readonly]="readonly()"
          [required]="required()"
          [value]="displayValue()"
          [class]="inputClass()"
          (input)="handleInput($event)"
          (blur)="handleBlur($event)"
          (focus)="handleFocus($event)"
          [attr.aria-describedby]="helperText() ? inputId + '-helper' : null"
          [attr.aria-invalid]="hasError()"
          [attr.aria-label]="ariaLabel()"
          [attr.aria-valuenow]="value()"
          [attr.aria-valuemin]="0"
          [attr.aria-valuemax]="999999999.99"
        />

        @if (helperText() || hasError()) {
        <mat-hint [class]="helperClass()">
          {{ errorMessage() || helperText() }}
        </mat-hint>
        }
      </mat-form-field>
    </div>
  `,
  styleUrls: ['./os-money-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OsMoneyInputComponent),
      multi: true,
    },
  ],
})
export class OsMoneyInputComponent implements ControlValueAccessor {
  size = input<OsMoneyInputSize>('medium');
  label = input<string>('');
  placeholder = input<string>('0,00');
  helperText = input<string>('');
  errorMessage = input<string>('');
  disabled = model(false);
  readonly = input(false);
  required = input(false);
  value = model<number>(0);
  allowNegative = input<boolean>(false);
  isFormatting = model<boolean>(false);

  valueChange = output<number>();
  blurEvent = output<FocusEvent>();
  focusEvent = output<FocusEvent>();

  private _onChange = (value: number) => {
    // This will be set by registerOnChange
    console.debug('onChange called with:', value);
  };
  private _onTouched = () => {
    // This will be set by registerOnTouched
  };

  inputId = `os-money-input-${Math.random().toString(36).substr(2, 9)}`;

  containerClass = computed(() => {
    return [
      'os-money-input-container',
      `os-money-input-container--${this.size()}`,
      this.hasError() ? 'os-money-input-container--error' : '',
      this.disabled() ? 'os-money-input-container--disabled' : '',
      this.isFormatting() ? 'os-money-input-container--formatting' : '',
      this.isLargeValue() ? 'os-money-input-container--success' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  labelClass = computed(() => {
    return ['os-money-input__label', this.required() ? 'os-money-input__label--required' : '']
      .filter(Boolean)
      .join(' ');
  });

  inputWrapperClass = computed(() => {
    return ['os-money-input__wrapper', this.disabled() ? 'os-money-input__wrapper--disabled' : '']
      .filter(Boolean)
      .join(' ');
  });

  inputClass = computed(() => {
    return [
      'os-money-input',
      `os-money-input--${this.size()}`,
      this.hasError() ? 'os-money-input--error' : '',
      this.disabled() ? 'os-money-input--disabled' : '',
      this.readonly() ? 'os-money-input--readonly' : '',
      this.isLargeValue() ? 'os-money-input--large-value' : '',
      this.isAnimating() ? 'os-money-input--animating' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  helperClass = computed(() => {
    return ['os-money-input__helper', this.hasError() ? 'os-money-input__helper--error' : '']
      .filter(Boolean)
      .join(' ');
  });

  hasError = computed(() => {
    return !!this.errorMessage();
  });

  // Mapeamento interno para Material
  protected appearance = computed((): MatFormFieldAppearance => 'outline');

  protected formFieldClass = computed(() => {
    return [
      'os-money-input__form-field',
      `os-money-input__form-field--${this.size()}`,
      this.hasError() ? 'os-money-input__form-field--error' : '',
      this.disabled() ? 'os-money-input__form-field--disabled' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  displayValue = computed(() => {
    const value = this.value();
    if (value === 0 && !this.placeholder()) return '';
    return this.formatCurrency(value);
  });

  isLargeValue = computed(() => {
    return Math.abs(this.value()) >= 10000;
  });

  isAnimating = computed(() => {
    return this.isFormatting();
  });

  ariaLabel = computed(() => {
    const label = this.label();
    const value = this.value();
    if (label && value !== 0) {
      return `${label}: ${this.formatCurrency(value)}`;
    }
    return label || 'Valor monetário';
  });

  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }

  private parseCurrency(value: string): number {
    // Handle negative values first
    const isNegative = value.includes('-');

    // Remove all non-digit characters except decimal separators
    const cleanValue = value.replace(/[^\d,.-]/g, '');
    if (!cleanValue) return 0;

    // Simple approach: if comma exists, treat it as decimal separator
    if (cleanValue.includes(',')) {
      const normalizedValue = cleanValue.replace(',', '.');
      const numericValue = parseFloat(normalizedValue);

      if (isNaN(numericValue)) return 0;

      // Apply negative sign if needed
      const finalValue = isNegative ? -Math.abs(numericValue) : Math.abs(numericValue);

      // Validate negative values
      if (finalValue < 0 && !this.allowNegative()) {
        return 0;
      }

      return finalValue;
    }

    // For values without comma, treat as cents (quick entry)
    const numericValue = parseFloat(cleanValue);
    if (isNaN(numericValue)) return 0;

    // Convert cents to currency (divide by 100)
    const currencyValue = numericValue / 100;

    // Apply negative sign if needed
    const finalValue = isNegative ? -Math.abs(currencyValue) : Math.abs(currencyValue);

    // Validate negative values
    if (finalValue < 0 && !this.allowNegative()) {
      return 0;
    }

    return finalValue;
  }

  private applyInputMask(value: string): string {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');

    if (!digits) return '';

    // Convert to number and format
    const numericValue = parseFloat(digits) / 100;
    return this.formatCurrency(numericValue);
  }

  handleInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const rawValue = target.value;

    // Set formatting state
    this.isFormatting.set(true);

    // Parse the numeric value first
    const numericValue = this.parseCurrency(rawValue);

    // Apply input mask for real-time formatting only if needed
    const maskedValue = this.applyInputMask(rawValue);
    target.value = maskedValue;

    // Update value
    this.value.set(numericValue);
    this._onChange(numericValue);
    this.valueChange.emit(numericValue);

    // Clear formatting state after a short delay
    setTimeout(() => {
      this.isFormatting.set(false);
    }, 100);
  }

  handleBlur(event: FocusEvent): void {
    this._onTouched();
    this.blurEvent.emit(event);
  }

  handleFocus(event: FocusEvent): void {
    this.focusEvent.emit(event);
  }

  writeValue(value: number): void {
    // Update the model signal when FormControl value changes programmatically
    if (value !== this.value()) {
      this.value.set(value);
    }
  }

  registerOnChange(fn: (value: number) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Update the disabled state when called by Angular Forms
    this.disabled.set(isDisabled);
  }
}
