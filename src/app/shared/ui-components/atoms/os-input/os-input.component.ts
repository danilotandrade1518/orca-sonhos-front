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
import { MatButtonModule } from '@angular/material/button';
import { OsIconComponent } from '../os-icon/os-icon.component';

export type OsInputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
export type OsInputSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'os-input',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatFormFieldModule, MatButtonModule, OsIconComponent],
  template: `
    <div [class]="containerClass()">
      <mat-form-field [appearance]="appearance()" [class]="formFieldClass()">
        @if (label()) {
        <mat-label>{{ label() }}</mat-label>
        } @if (prefixIcon()) {
        <os-icon [name]="prefixIcon()" matPrefix [class]="prefixIconClass()"></os-icon>
        }

        <input
          matInput
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
          [attr.aria-required]="required()"
          [attr.aria-disabled]="disabled()"
        />

        @if (suffixIcon()) {
        <os-icon [name]="suffixIcon()" matSuffix [class]="suffixIconClass()"></os-icon>
        } @if (clearable() && value() && !disabled()) {
        <button
          matSuffix
          mat-icon-button
          type="button"
          class="os-input__clear"
          (click)="handleClear()"
          [attr.aria-label]="'Clear ' + (label() || 'input')"
        >
          <os-icon name="close"></os-icon>
        </button>
        } @if (helperText() || hasError()) {
        <mat-hint [class]="helperClass()" [id]="inputId + '-helper'">
          {{ errorMessage() || helperText() }}
        </mat-hint>
        }
      </mat-form-field>
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
    
  };
  private _onTouched = () => {
    
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

  protected appearance = computed((): MatFormFieldAppearance => 'outline');

  protected formFieldClass = computed(() => {
    return [
      'os-input__form-field',
      `os-input__form-field--${this.size()}`,
      this.hasError() ? 'os-input__form-field--error' : '',
      this.disabled() ? 'os-input__form-field--disabled' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  protected prefixIconClass = computed(() => {
    return ['os-input__prefix-icon', `os-input__prefix-icon--${this.size()}`]
      .filter(Boolean)
      .join(' ');
  });

  protected suffixIconClass = computed(() => {
    return ['os-input__suffix-icon', `os-input__suffix-icon--${this.size()}`]
      .filter(Boolean)
      .join(' ');
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
    this.disabled.set(isDisabled);
  }
}
