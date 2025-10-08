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

export type OsSelectSize = 'small' | 'medium' | 'large';

export interface OsSelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'os-select',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="containerClass()">
      @if (label()) {
      <label [for]="selectId" [class]="labelClass()">
        {{ label() }}
        @if (required()) {
        <span class="os-select__required" aria-label="required">*</span>
        }
      </label>
      }

      <div [class]="selectWrapperClass()">
        <select
          [id]="selectId"
          [disabled]="disabled()"
          [required]="required()"
          [value]="value()"
          [class]="selectClass()"
          (change)="handleChange($event)"
          (blur)="handleBlur($event)"
          (focus)="handleFocus($event)"
          [attr.aria-describedby]="helperText() ? selectId + '-helper' : null"
          [attr.aria-invalid]="hasError()"
        >
          @if (placeholder()) {
          <option value="" disabled>{{ placeholder() }}</option>
          } @for (option of options(); track option.value) {
          <option [value]="option.value" [disabled]="option.disabled">
            {{ option.label }}
          </option>
          }
        </select>

        <span class="os-select__arrow" [attr.aria-hidden]="true">▼</span>
      </div>

      @if (helperText() || hasError()) {
      <div [id]="selectId + '-helper'" [class]="helperClass()">
        {{ errorMessage() || helperText() }}
      </div>
      }
    </div>
  `,
  styleUrls: ['./os-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OsSelectComponent),
      multi: true,
    },
  ],
})
export class OsSelectComponent implements ControlValueAccessor {
  size = input<OsSelectSize>('medium');
  label = input<string>('');
  placeholder = input<string>('');
  helperText = input<string>('');
  errorMessage = input<string>('');
  disabled = input(false);
  required = input(false);
  value = input<string | number>('');
  options = input<OsSelectOption[]>([]);

  valueChange = output<string | number>();
  blur = output<FocusEvent>();
  focus = output<FocusEvent>();

  private _onChange = (value: string | number) => {};
  private _onTouched = () => {};

  selectId = `os-select-${Math.random().toString(36).substr(2, 9)}`;

  containerClass = computed(() => {
    return [
      'os-select-container',
      `os-select-container--${this.size()}`,
      this.hasError() ? 'os-select-container--error' : '',
      this.disabled() ? 'os-select-container--disabled' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  labelClass = computed(() => {
    return ['os-select__label', this.required() ? 'os-select__label--required' : '']
      .filter(Boolean)
      .join(' ');
  });

  selectWrapperClass = computed(() => {
    return ['os-select__wrapper', this.disabled() ? 'os-select__wrapper--disabled' : '']
      .filter(Boolean)
      .join(' ');
  });

  selectClass = computed(() => {
    return [
      'os-select',
      `os-select--${this.size()}`,
      this.hasError() ? 'os-select--error' : '',
      this.disabled() ? 'os-select--disabled' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  helperClass = computed(() => {
    return ['os-select__helper', this.hasError() ? 'os-select__helper--error' : '']
      .filter(Boolean)
      .join(' ');
  });

  hasError = computed(() => {
    return !!this.errorMessage();
  });

  handleChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newValue = target.value;
    this._onChange(newValue);
    this.valueChange.emit(newValue);
  }

  handleBlur(event: FocusEvent): void {
    this._onTouched();
    this.blur.emit(event);
  }

  handleFocus(event: FocusEvent): void {
    this.focus.emit(event);
  }

  writeValue(value: string | number): void {
    // Value is controlled by input signal
  }

  registerOnChange(fn: (value: string | number) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {}
}
