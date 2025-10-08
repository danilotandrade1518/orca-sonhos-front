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

export type OsInputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
export type OsInputSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'os-input',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="containerClass()">
      @if (label()) {
      <label [for]="inputId" [class]="labelClass()">
        {{ label() }}
        @if (required()) {
        <span class="os-input__required" aria-label="required">*</span>
        }
      </label>
      }

      <div [class]="inputWrapperClass()">
        @if (prefixIcon()) {
        <span class="os-input__prefix-icon" [attr.aria-hidden]="true">
          {{ prefixIcon() }}
        </span>
        }

        <input
          [id]="inputId"
          [type]="type()"
          [placeholder]="placeholder()"
          [disabled]="disabled()"
          [readonly]="readonly()"
          [required]="required()"
          [value]="value()"
          [class]="inputClass()"
          (input)="handleInput($event)"
          (blur)="handleBlur($event)"
          (focus)="handleFocus($event)"
          [attr.aria-describedby]="helperText() ? inputId + '-helper' : null"
          [attr.aria-invalid]="hasError()"
        />

        @if (suffixIcon()) {
        <span class="os-input__suffix-icon" [attr.aria-hidden]="true">
          {{ suffixIcon() }}
        </span>
        } @if (clearable() && value() && !disabled()) {
        <button
          type="button"
          class="os-input__clear"
          (click)="handleClear()"
          [attr.aria-label]="'Clear ' + (label() || 'input')"
        >
          ×
        </button>
        }
      </div>

      @if (helperText() || hasError()) {
      <div [id]="inputId + '-helper'" [class]="helperClass()">
        {{ errorMessage() || helperText() }}
      </div>
      }
    </div>
  `,
  styleUrls: ['./os-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OsInputComponent),
      multi: true,
    },
  ],
})
export class OsInputComponent implements ControlValueAccessor {
  type = input<OsInputType>('text');
  size = input<OsInputSize>('medium');
  label = input<string>('');
  placeholder = input<string>('');
  helperText = input<string>('');
  errorMessage = input<string>('');
  disabled = model(false);
  readonly = input(false);
  required = input(false);
  clearable = input(false);
  prefixIcon = input<string>('');
  suffixIcon = input<string>('');
  value = model<string>('');

  valueChange = output<string>();
  blurEvent = output<FocusEvent>();
  focusEvent = output<FocusEvent>();

  private _onChange = (value: string) => {
    // This will be set by registerOnChange
    console.debug('onChange called with:', value);
  };
  private _onTouched = () => {
    // This will be set by registerOnTouched
  };

  inputId = `os-input-${Math.random().toString(36).substr(2, 9)}`;

  containerClass = computed(() => {
    return [
      'os-input-container',
      `os-input-container--${this.size()}`,
      this.hasError() ? 'os-input-container--error' : '',
      this.disabled() ? 'os-input-container--disabled' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  labelClass = computed(() => {
    return ['os-input__label', this.required() ? 'os-input__label--required' : '']
      .filter(Boolean)
      .join(' ');
  });

  inputWrapperClass = computed(() => {
    return [
      'os-input__wrapper',
      this.prefixIcon() ? 'os-input__wrapper--with-prefix' : '',
      this.suffixIcon() ? 'os-input__wrapper--with-suffix' : '',
      this.clearable() ? 'os-input__wrapper--clearable' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  inputClass = computed(() => {
    return [
      'os-input',
      `os-input--${this.size()}`,
      this.hasError() ? 'os-input--error' : '',
      this.disabled() ? 'os-input--disabled' : '',
      this.readonly() ? 'os-input--readonly' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  helperClass = computed(() => {
    return ['os-input__helper', this.hasError() ? 'os-input__helper--error' : '']
      .filter(Boolean)
      .join(' ');
  });

  hasError = computed(() => {
    return !!this.errorMessage();
  });

  handleInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newValue = target.value;
    this._onChange(newValue);
    this.valueChange.emit(newValue);
  }

  handleBlur(event: FocusEvent): void {
    this._onTouched();
    this.blurEvent.emit(event);
  }

  handleFocus(event: FocusEvent): void {
    this.focusEvent.emit(event);
  }

  handleClear(): void {
    this._onChange('');
    this.valueChange.emit('');
  }

  writeValue(value: string): void {
    // Update the model signal when FormControl value changes programmatically
    if (value !== this.value()) {
      this.value.set(value);
    }
  }

  registerOnChange(fn: (value: string) => void): void {
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
