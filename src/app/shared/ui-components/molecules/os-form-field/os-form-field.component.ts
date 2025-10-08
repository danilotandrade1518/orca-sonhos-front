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
import { OsInputComponent } from '../../atoms/os-input/os-input.component';
import { OsLabelComponent } from '../../atoms/os-label/os-label.component';

export type OsFormFieldSize = 'small' | 'medium' | 'large';
export type OsFormFieldVariant = 'default' | 'outlined' | 'filled';
export type OsFormFieldType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';

@Component({
  selector: 'os-form-field',
  standalone: true,
  imports: [CommonModule, FormsModule, OsInputComponent, OsLabelComponent],
  template: `
    <div [class]="containerClass()">
      @if (label()) {
      <os-label
        [for]="inputId"
        [required]="required()"
        [size]="size()"
        [variant]="labelVariant()"
        [disabled]="disabled()"
      >
        {{ label() }}
      </os-label>
      }

      <os-input
        [id]="inputId"
        [type]="type()"
        [placeholder]="placeholder()"
        [value]="value()"
        [disabled]="disabled()"
        [readonly]="readonly()"
        [required]="required()"
        [size]="size()"
        [helperText]="helperText()"
        [errorMessage]="errorMessage()"
        [prefixIcon]="prefixIcon()"
        [suffixIcon]="suffixIcon()"
        [clearable]="clearable()"
        (valueChange)="handleValueChange($event)"
        (blurEvent)="handleBlur($event)"
        (focusEvent)="handleFocus($event)"
      />

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

  readonly labelVariant = computed(() => {
    if (this.errorMessage()) return 'error';
    if (this.disabled()) return 'default';
    return 'default';
  });

  readonly inputVariant = computed(() => {
    if (this.errorMessage()) return 'error';
    if (this.disabled()) return 'disabled';
    return 'default';
  });

  readonly hintClass = computed(() => {
    const classes = ['os-form-field__hint'];
    classes.push(`os-form-field__hint--${this.size()}`);

    if (this.disabled()) {
      classes.push('os-form-field__hint--disabled');
    }

    return classes.join(' ');
  });

  handleValueChange(value: string): void {
    this.value.set(value);
    this.valueChange.emit(value);
    this._onChange(value);
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
