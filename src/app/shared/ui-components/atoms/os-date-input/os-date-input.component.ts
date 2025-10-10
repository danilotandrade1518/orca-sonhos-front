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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';

export type OsDateInputSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'os-date-input',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatIconModule,
    MatButtonModule,
    MatNativeDateModule,
  ],
  template: `
    <div [class]="containerClass()">
      <mat-form-field [appearance]="appearance()" [class]="formFieldClass()">
        @if (label()) {
        <mat-label>{{ label() }}</mat-label>
        } @if (prefixIcon()) {
        <mat-icon matPrefix [class]="prefixIconClass()">{{ prefixIcon() }}</mat-icon>
        }

        <input
          matInput
          [matDatepicker]="picker"
          [id]="inputId"
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
        <mat-icon matSuffix [class]="suffixIconClass()">{{ suffixIcon() }}</mat-icon>
        } @else {
        <mat-datepicker-toggle matSuffix [for]="picker" [disabled]="disabled()">
          <mat-icon matDatepickerToggleIcon>calendar_today</mat-icon>
        </mat-datepicker-toggle>
        }
        <mat-datepicker #picker></mat-datepicker>

        @if (helperText() || hasError()) {
        <mat-hint [class]="helperClass()">
          {{ errorMessage() || helperText() }}
        </mat-hint>
        }
      </mat-form-field>
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
  disabled = model(false);
  readonly = input(false);
  required = input(false);
  prefixIcon = input<string>('');
  suffixIcon = input<string>('');
  value = model<Date | null>(null);
  minDate = input<string>('');
  maxDate = input<string>('');

  valueChange = output<Date | null>();
  blurEvent = output<FocusEvent>();
  focusEvent = output<FocusEvent>();

  private _onChange = (value: Date | null) => {
    // This will be set by registerOnChange
    console.debug('onChange called with:', value);
  };
  private _onTouched = () => {
    // This will be set by registerOnTouched
  };

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

  // Mapeamento interno para Material
  protected appearance = computed((): MatFormFieldAppearance => 'outline');

  protected formFieldClass = computed(() => {
    return [
      'os-date-input__form-field',
      `os-date-input__form-field--${this.size()}`,
      this.hasError() ? 'os-date-input__form-field--error' : '',
      this.disabled() ? 'os-date-input__form-field--disabled' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  protected prefixIconClass = computed(() => {
    return ['os-date-input__prefix-icon', `os-date-input__prefix-icon--${this.size()}`]
      .filter(Boolean)
      .join(' ');
  });

  protected suffixIconClass = computed(() => {
    return ['os-date-input__suffix-icon', `os-date-input__suffix-icon--${this.size()}`]
      .filter(Boolean)
      .join(' ');
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
    this.blurEvent.emit(event);
  }

  handleFocus(event: FocusEvent): void {
    this.focusEvent.emit(event);
  }

  writeValue(value: Date | null): void {
    // Update the model signal when FormControl value changes programmatically
    if (value !== this.value()) {
      this.value.set(value);
    }
  }

  registerOnChange(fn: (value: Date | null) => void): void {
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
