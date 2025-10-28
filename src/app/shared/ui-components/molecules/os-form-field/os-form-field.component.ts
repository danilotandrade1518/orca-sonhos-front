import {
  Component,
  input,
  output,
  computed,
  model,
  ChangeDetectionStrategy,
  forwardRef,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormsModule,
  AbstractControl,
} from '@angular/forms';
import { OsInputComponent } from '../../atoms/os-input/os-input.component';
import { OsLabelComponent } from '../../atoms/os-label/os-label.component';
import { OsIconComponent } from '../../atoms/os-icon/os-icon.component';

export type OsFormFieldSize = 'small' | 'medium' | 'large';
export type OsFormFieldVariant = 'default' | 'outlined' | 'filled';
export type OsFormFieldType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
export type OsFormFieldValidationState = 'pristine' | 'dirty' | 'touched' | 'invalid' | 'valid';

@Component({
  selector: 'os-form-field',
  standalone: true,
  imports: [CommonModule, FormsModule, OsInputComponent, OsLabelComponent, OsIconComponent],
  template: `
    <div
      [class]="containerClass()"
      [attr.aria-invalid]="hasError()"
      [attr.aria-describedby]="ariaDescribedBy()"
      [attr.aria-required]="required()"
      role="group"
    >
      @if (label()) {
      <os-label
        [for]="fieldId()"
        [size]="size()"
        [variant]="labelVariant()"
        [required]="required()"
        [id]="fieldId() + '-label'"
      >
        {{ label() }}
      </os-label>
      }

      <div class="os-form-field__input-container">
        <os-input
          [id]="fieldId()"
          [type]="type()"
          [placeholder]="placeholder()"
          [disabled]="disabled()"
          [readonly]="readonly()"
          [required]="required()"
          [value]="value()"
          [errorMessage]="errorMessage()"
          [helperText]="helperText()"
          [size]="size()"
          [prefixIcon]="prefixIcon()"
          [suffixIcon]="suffixIcon()"
          [clearable]="clearable()"
          [aria-invalid]="hasError()"
          (valueChange)="onValueChange($event)"
          (blurEvent)="onBlur($event)"
          (focusEvent)="onFocus($event)"
        />

        @if (showValidationIcon()) {
        <div class="os-form-field__validation-icon" [attr.aria-hidden]="true">
          <os-icon
            [name]="validationIconName()"
            [size]="validationIconSize()"
            [variant]="validationIconVariant()"
          />
        </div>
        }
      </div>

      @if (errorMessage() && hasError()) {
      <div
        class="os-form-field__error-message"
        [id]="fieldId() + '-error'"
        role="alert"
        [attr.aria-live]="'assertive'"
      >
        <os-icon name="error" size="sm" variant="error" />
        <span>{{ errorMessage() }}</span>
      </div>
      } @else if (hintText() && !hasError()) {
      <div class="os-form-field__hint" [id]="fieldId() + '-hint'" [class]="hintClass()">
        {{ hintText() }}
      </div>
      } @if (showCharacterCount()) {
      <div
        class="os-form-field__character-count"
        [id]="fieldId() + '-count'"
        [attr.aria-live]="'polite'"
      >
        {{ characterCount() }}/{{ maxLength() }}
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
  readonly maxLength = input<number>(0);
  readonly showValidationIcon = input(true);
  readonly validationState = input<OsFormFieldValidationState>('pristine');
  readonly control = input<AbstractControl | null>(null);

  readonly valueChange = output<string>();
  readonly blurEvent = output<FocusEvent>();
  readonly focusEvent = output<FocusEvent>();
  readonly validationChange = output<OsFormFieldValidationState>();

  private readonly _touched = signal(false);
  private readonly _dirty = signal(false);

  protected fieldId = computed(() => `field-${Math.random().toString(36).substr(2, 9)}`);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _onChange = (value: string) => {};
  private _onTouched = () => {};

  protected labelVariant = computed(() => {
    if (this.hasError()) return 'error';
    return 'default';
  });

  readonly hasError = computed(() => {
    const control = this.control();
    if (control) {
      return control.invalid && (control.touched || control.dirty);
    }
    return !!this.errorMessage();
  });

  readonly isTouched = computed(() => {
    const control = this.control();
    if (control) {
      return control.touched;
    }
    return this._touched();
  });

  readonly isDirty = computed(() => {
    const control = this.control();
    if (control) {
      return control.dirty;
    }
    return this._dirty();
  });

  readonly characterCount = computed(() => {
    return this.value().length;
  });

  readonly showCharacterCount = computed(() => {
    return this.maxLength() > 0;
  });

  readonly validationIconName = computed(() => {
    if (this.hasError()) return 'error';
    if (this.isValid()) return 'check_circle';
    return '';
  });

  readonly validationIconSize = computed(() => {
    return this.size() === 'small' ? 'xs' : 'sm';
  });

  readonly validationIconVariant = computed(() => {
    if (this.hasError()) return 'error';
    if (this.isValid()) return 'success';
    return 'default';
  });

  readonly ariaDescribedBy = computed(() => {
    const ids = [];
    if (this.hintText() && !this.hasError()) {
      ids.push(this.fieldId() + '-hint');
    }
    if (this.hasError()) {
      ids.push(this.fieldId() + '-error');
    }
    if (this.showCharacterCount()) {
      ids.push(this.fieldId() + '-count');
    }
    return ids.length > 0 ? ids.join(' ') : null;
  });

  readonly hintClass = computed(() => {
    const classes = ['os-form-field__hint'];
    classes.push(`os-form-field__hint--${this.size()}`);

    if (this.disabled()) {
      classes.push('os-form-field__hint--disabled');
    }

    return classes.join(' ');
  });

  readonly containerClass = computed(() => {
    const classes = ['os-form-field'];
    classes.push(`os-form-field--${this.size()}`);
    classes.push(`os-form-field--${this.variant()}`);

    if (this.disabled()) {
      classes.push('os-form-field--disabled');
    }

    if (this.hasError()) {
      classes.push('os-form-field--error');
    }

    if (this.required()) {
      classes.push('os-form-field--required');
    }

    if (this.isTouched()) {
      classes.push('os-form-field--touched');
    }

    if (this.isDirty()) {
      classes.push('os-form-field--dirty');
    }

    return classes.join(' ');
  });

  private isValid = computed(() => {
    const control = this.control();
    if (control) {
      return control.valid && (control.touched || control.dirty);
    }
    return !this.hasError() && this.value().length > 0;
  });

  onValueChange(value: string): void {
    this.value.set(value);
    this.valueChange.emit(value);
    this._onChange(value);

    this._dirty.set(true);
    this.updateValidationState();
  }

  onBlur(event: FocusEvent): void {
    this.blurEvent.emit(event);
    this._onTouched();
    this._touched.set(true);
    this.updateValidationState();
  }

  onFocus(event: FocusEvent): void {
    this.focusEvent.emit(event);
  }

  private updateValidationState(): void {
    const control = this.control();
    let state: OsFormFieldValidationState = 'pristine';

    if (control) {
      if (control.touched) state = 'touched';
      if (control.dirty) state = 'dirty';
      if (control.invalid) state = 'invalid';
      if (control.valid) state = 'valid';
    } else {
      if (this._touched()) state = 'touched';
      if (this._dirty()) state = 'dirty';
      if (this.hasError()) state = 'invalid';
      if (this.isValid()) state = 'valid';
    }

    this.validationChange.emit(state);
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
