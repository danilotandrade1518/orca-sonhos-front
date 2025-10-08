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

export type OsMoneyInputSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'os-money-input',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="containerClass()">
      @if (label()) {
      <label [for]="inputId" [class]="labelClass()">
        {{ label() }}
        @if (required()) {
        <span class="os-money-input__required" aria-label="required">*</span>
        }
      </label>
      }

      <div [class]="inputWrapperClass()">
        <span class="os-money-input__currency" [attr.aria-hidden]="true">R$</span>

        <input
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
        />
      </div>

      @if (helperText() || hasError()) {
      <div [id]="inputId + '-helper'" [class]="helperClass()">
        {{ errorMessage() || helperText() }}
      </div>
      }
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
  disabled = input(false);
  readonly = input(false);
  required = input(false);
  value = model<number>(0);

  valueChange = output<number>();
  blur = output<FocusEvent>();
  focus = output<FocusEvent>();

  private _onChange = (value: number) => {};
  private _onTouched = () => {};

  inputId = `os-money-input-${Math.random().toString(36).substr(2, 9)}`;

  containerClass = computed(() => {
    return [
      'os-money-input-container',
      `os-money-input-container--${this.size()}`,
      this.hasError() ? 'os-money-input-container--error' : '',
      this.disabled() ? 'os-money-input-container--disabled' : '',
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

  displayValue = computed(() => {
    const value = this.value();
    if (value === 0 && !this.placeholder()) return '';
    return this.formatCurrency(value);
  });

  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }

  private parseCurrency(value: string): number {
    const cleanValue = value.replace(/[^\d]/g, '');
    if (!cleanValue) return 0;
    return parseFloat(cleanValue) / 100;
  }

  handleInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const rawValue = target.value;
    const numericValue = this.parseCurrency(rawValue);

    this._onChange(numericValue);
    this.valueChange.emit(numericValue);
  }

  handleBlur(event: FocusEvent): void {
    this._onTouched();
    this.blur.emit(event);
  }

  handleFocus(event: FocusEvent): void {
    this.focus.emit(event);
  }

  writeValue(value: number): void {
    this.value.set(value || 0);
  }

  registerOnChange(fn: (value: number) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {}
}
