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
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule, MatFormFieldAppearance } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export type OsFormFieldSize = 'small' | 'medium' | 'large';
export type OsFormFieldVariant = 'default' | 'outlined' | 'filled';
export type OsFormFieldType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';

@Component({
  selector: 'os-form-field',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
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
        <mat-icon matSuffix [class]="suffixIconClass()">{{ suffixIcon() }}</mat-icon>
        } @if (clearable() && value() && !disabled()) {
        <button
          matSuffix
          mat-icon-button
          type="button"
          class="os-form-field__clear"
          (click)="handleClear()"
          [attr.aria-label]="'Clear ' + (label() || 'input')"
        >
          <mat-icon>close</mat-icon>
        </button>
        } @if (helperText() || hasError()) {
        <mat-hint [class]="helperClass()">
          {{ errorMessage() || helperText() }}
        </mat-hint>
        }
      </mat-form-field>

      @if (hintText() && !errorMessage()) {
      <div [class]="hintClass()" [id]="inputId + '-hint'">
        {{ hintText() }}
      </div>
      }
    </div>
  `,
  styleUrls: ['./os-form-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OsFormFieldComponent),
      multi: true,
    },
  ],
})
export class OsFormFieldComponent implements ControlValueAccessor {
  // Input properties
  readonly label = input<string>('');
  readonly placeholder = input<string>('');
  readonly helperText = input<string>('');
  readonly hintText = input<string>('');
  readonly errorMessage = input<string>('');
  readonly type = input<OsFormFieldType>('text');
  readonly size = input<OsFormFieldSize>('medium');
  readonly variant = input<OsFormFieldVariant>('default');
  readonly required = input(false);
  readonly disabled = model(false);
  readonly readonly = input(false);
  readonly clearable = input(false);
  readonly prefixIcon = input<string>('');
  readonly suffixIcon = input<string>('');
  readonly value = model<string>('');

  readonly valueChange = output<string>();
  readonly blurEvent = output<FocusEvent>();
  readonly focusEvent = output<FocusEvent>();

  protected inputId = `os-form-field-${Math.random().toString(36).substr(2, 9)}`;

  private _onChange = (value: string) => {
    console.debug('onChange called with:', value);
  };
  private _onTouched = () => {
    console.debug('onTouched called');
  };

  // Mapeamento interno para Material
  protected appearance = computed((): MatFormFieldAppearance => 'outline');

  protected hasError = computed(() => !!this.errorMessage());

  readonly containerClass = computed(() => {
    const classes = ['os-form-field'];
    classes.push(`os-form-field--${this.size()}`);
    classes.push(`os-form-field--${this.variant()}`);

    if (this.disabled()) {
      classes.push('os-form-field--disabled');
    }

    if (this.errorMessage()) {
      classes.push('os-form-field--error');
    }

    if (this.required()) {
      classes.push('os-form-field--required');
    }

    return classes.join(' ');
  });

  protected formFieldClass = computed(() => {
    return [
      'os-form-field__form-field',
      `os-form-field__form-field--${this.size()}`,
      this.hasError() ? 'os-form-field__form-field--error' : '',
      this.disabled() ? 'os-form-field__form-field--disabled' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  protected inputClass = computed(() => {
    return ['os-form-field__input', `os-form-field__input--${this.size()}`]
      .filter(Boolean)
      .join(' ');
  });

  protected prefixIconClass = computed(() => {
    return ['os-form-field__prefix-icon', `os-form-field__prefix-icon--${this.size()}`]
      .filter(Boolean)
      .join(' ');
  });

  protected suffixIconClass = computed(() => {
    return ['os-form-field__suffix-icon', `os-form-field__suffix-icon--${this.size()}`]
      .filter(Boolean)
      .join(' ');
  });

  protected helperClass = computed(() => {
    return [
      'os-form-field__helper',
      `os-form-field__helper--${this.size()}`,
      this.hasError() ? 'os-form-field__helper--error' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  readonly hintClass = computed(() => {
    const classes = ['os-form-field__hint'];
    classes.push(`os-form-field__hint--${this.size()}`);

    if (this.disabled()) {
      classes.push('os-form-field__hint--disabled');
    }

    return classes.join(' ');
  });

  handleInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    this.value.set(value);
    this.valueChange.emit(value);
    this._onChange(value);
  }

  handleClear(): void {
    this.value.set('');
    this.valueChange.emit('');
    this._onChange('');
  }

  handleBlur(event: FocusEvent): void {
    this.blurEvent.emit(event);
    this._onTouched();
  }

  handleFocus(event: FocusEvent): void {
    this.focusEvent.emit(event);
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
