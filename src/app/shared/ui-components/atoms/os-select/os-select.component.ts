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
          (selectionChange)="handleChange($event)"
          (blur)="handleBlur($event)"
          (focus)="handleFocus($event)"
          [attr.aria-describedby]="helperText() ? selectId + '-helper' : null"
          [attr.aria-invalid]="hasError()"
        >
          @for (option of options(); track option.value) {
          <mat-option [value]="option.value" [disabled]="option.disabled">
            {{ option.label }}
          </mat-option>
          }
        </mat-select>

        @if (helperText() || hasError()) {
        <mat-hint [class]="helperClass()">
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

  valueChange = output<string | number>();
  blurEvent = output<FocusEvent>();
  focusEvent = output<FocusEvent>();

  private _onChange = (value: string | number) => {
    // This will be set by registerOnChange
    console.debug('onChange called with:', value);
  };
  private _onTouched = () => {
    // This will be set by registerOnTouched
  };

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

  // Mapeamento interno para Material
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

  writeValue(value: string | number): void {
    // Update the model signal when FormControl value changes programmatically
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
    // Update the disabled state when called by Angular Forms
    this.disabled.set(isDisabled);
  }
}
