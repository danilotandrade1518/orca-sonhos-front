import {
  Component,
  input,
  output,
  computed,
  model,
  signal,
  ChangeDetectionStrategy,
  forwardRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule, MatFormFieldAppearance } from '@angular/material/form-field';

export type OsSelectSize = 'small' | 'medium' | 'large';

export interface OsSelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'os-select',
  standalone: true,
  imports: [CommonModule, MatSelectModule, MatFormFieldModule],
  template: `
    <div [class]="containerClass()">
      <mat-form-field [appearance]="appearance()" [class]="formFieldClass()">
        @if (label()) {
        <mat-label>{{ label() }}</mat-label>
        }

        <mat-select
          [id]="selectId"
          [disabled]="disabled()"
          [required]="required()"
          [value]="value()"
          [placeholder]="placeholder()"
          [class]="selectClass()"
          [attr.aria-label]="ariaLabel() || label()"
          [attr.aria-describedby]="computedAriaDescribedBy()"
          [attr.aria-invalid]="hasError()"
          [attr.aria-required]="required() ? 'true' : 'false'"
          [attr.aria-disabled]="disabled() ? 'true' : 'false'"
          [attr.tabindex]="disabled() ? -1 : 0"
          (selectionChange)="handleChange($event)"
          (blur)="handleBlur($event)"
          (focus)="handleFocus($event)"
          (openedChange)="onOpenedChange($event)"
        >
          @for (option of options(); track option.value) {
          <mat-option [value]="option.value" [disabled]="option.disabled">
            {{ option.label }}
          </mat-option>
          }
        </mat-select>

        @if (helperText() || hasError()) {
        <mat-hint [id]="selectId + '-helper'" [class]="helperClass()">
          {{ errorMessage() || helperText() }}
        </mat-hint>
        }
      </mat-form-field>
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
  disabled = model(false);
  required = input(false);
  value = model<string | number>('');
  options = input<OsSelectOption[]>([]);
  ariaLabel = input<string>('');
  ariaDescribedBy = input<string>('');
  animated = input(true);
  hapticFeedback = input(true);

  valueChange = output<string | number>();
  blurEvent = output<FocusEvent>();
  focusEvent = output<FocusEvent>();
  openedChange = output<boolean>();

  private _onChange = (_value: string | number) => {
    // Value change handled by valueChange output
  };
  private _onTouched = () => {};

  selectId = `os-select-${Math.random().toString(36).substr(2, 9)}`;
  isFocused = signal(false);
  isHovered = signal(false);
  isOpened = signal(false);

  containerClass = computed(() => {
    return [
      'os-select-container',
      `os-select-container--${this.size()}`,
      this.hasError() ? 'os-select-container--error' : '',
      this.disabled() ? 'os-select-container--disabled' : '',
      this.isFocused() ? 'os-select-container--focused' : '',
      this.isHovered() ? 'os-select-container--hovered' : '',
      this.isOpened() ? 'os-select-container--opened' : '',
      this.animated() ? 'os-select-container--animated' : '',
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

  computedAriaDescribedBy = computed(() => {
    const helperId = this.helperText() ? this.selectId + '-helper' : null;
    const describedBy = this.ariaDescribedBy();
    return describedBy || helperId;
  });

  protected appearance = computed((): MatFormFieldAppearance => 'outline');

  protected formFieldClass = computed(() => {
    return [
      'os-select__form-field',
      `os-select__form-field--${this.size()}`,
      this.hasError() ? 'os-select__form-field--error' : '',
      this.disabled() ? 'os-select__form-field--disabled' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  handleChange(event: { value: string | number }): void {
    const newValue = event.value;
    this.triggerHapticFeedback();
    this._onChange(newValue);
    this.valueChange.emit(newValue);
  }

  handleBlur(event: FocusEvent): void {
    this.isFocused.set(false);
    this._onTouched();
    this.blurEvent.emit(event);
  }

  handleFocus(event: FocusEvent): void {
    this.isFocused.set(true);
    this.focusEvent.emit(event);
  }

  onOpenedChange(isOpened: boolean): void {
    this.isOpened.set(isOpened);
    this.openedChange.emit(isOpened);
  }

  triggerHapticFeedback(): void {
    if (this.hapticFeedback() && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }

  writeValue(value: string | number): void {
    if (value !== this.value()) {
      this.value.set(value);
    }
  }

  registerOnChange(fn: (value: string | number) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
