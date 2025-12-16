import {
  Component,
  input,
  output,
  computed,
  model,
  ChangeDetectionStrategy,
  forwardRef,
  DestroyRef,
  inject,
} from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule, MatFormFieldAppearance } from '@angular/material/form-field';
import { OsIconComponent } from '../os-icon/os-icon.component';

export type OsMoneyInputSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'os-money-input',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, OsIconComponent],
  template: `
    <div [class]="containerClass()">
      <mat-form-field [appearance]="appearance()" [class]="formFieldClass()">
        @if (label()) {
        <mat-label>{{ label() }}</mat-label>
        }

        <os-icon name="attach_money" matPrefix class="os-money-input__currency-icon" />

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

  private _onChange = (_value: number) => {
    
  };
  private _onTouched = () => {};

  private readonly destroyRef = inject(DestroyRef);
  private isDestroyed = false;

  inputId = `os-money-input-${Math.random().toString(36).substr(2, 9)}`;

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.isDestroyed = true;
    });
  }

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
    const isNegative = value.includes('-');

    const cleanValue = value.replace(/[^\d,.-]/g, '');
    if (!cleanValue) return 0;

    if (cleanValue.includes(',')) {
      const normalizedValue = cleanValue.replace(',', '.');
      const numericValue = parseFloat(normalizedValue);

      if (isNaN(numericValue)) return 0;

      const finalValue = isNegative ? -Math.abs(numericValue) : Math.abs(numericValue);

      if (finalValue < 0 && !this.allowNegative()) {
        return 0;
      }

      return finalValue;
    }

    const numericValue = parseFloat(cleanValue);
    if (isNaN(numericValue)) return 0;

    const currencyValue = numericValue / 100;

    const finalValue = isNegative ? -Math.abs(currencyValue) : Math.abs(currencyValue);

    if (finalValue < 0 && !this.allowNegative()) {
      return 0;
    }

    return finalValue;
  }

  private applyInputMask(value: string): string {
    const digits = value.replace(/\D/g, '');

    if (!digits) return '';

    const numericValue = parseFloat(digits) / 100;
    return this.formatCurrency(numericValue);
  }

  handleInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const rawValue = target.value;

    this.isFormatting.set(true);

    const numericValue = this.parseCurrency(rawValue);

    const maskedValue = this.applyInputMask(rawValue);
    target.value = maskedValue;

    this.value.set(numericValue);
    this._onChange(numericValue);
    this.valueChange.emit(numericValue);

    setTimeout(() => {
      if (!this.isDestroyed) {
        this.isFormatting.set(false);
      }
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
    this.disabled.set(isDisabled);
  }
}
