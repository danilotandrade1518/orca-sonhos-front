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
        [for]="fieldId()"
        [size]="size()"
        [variant]="labelVariant()"
        [required]="required()"
      >
        {{ label() }}
      </os-label>
      }

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
        (valueChange)="onValueChange($event)"
        (blurEvent)="onBlur($event)"
        (focusEvent)="onFocus($event)"
      />

      @if (hintText() && !errorMessage()) {
      <os-label [variant]="'default'" [size]="size()" [id]="fieldId() + '-hint'">
        {{ hintText() }}
      </os-label>
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

  protected fieldId = computed(() => `field-${Math.random().toString(36).substr(2, 9)}`);

  private _onChange = (value: string) => {
    console.debug('onChange called with:', value);
  };
  private _onTouched = () => {
    console.debug('onTouched called');
  };

  // Mapeamento interno para Atoms
  protected labelVariant = computed(() => {
    if (this.errorMessage()) return 'error';
    return 'default';
  });

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

  onValueChange(value: string): void {
    this.value.set(value);
    this.valueChange.emit(value);
    this._onChange(value);
  }

  onBlur(event: FocusEvent): void {
    this.blurEvent.emit(event);
    this._onTouched();
  }

  onFocus(event: FocusEvent): void {
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
