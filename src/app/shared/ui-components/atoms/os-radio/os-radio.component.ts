import {
  Component,
  input,
  output,
  computed,
  ChangeDetectionStrategy,
  forwardRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type OsRadioSize = 'small' | 'medium' | 'large';
export type OsRadioVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';

@Component({
  selector: 'os-radio',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="containerClass()">
      <input
        type="radio"
        [id]="inputId"
        [name]="name()"
        [value]="value()"
        [checked]="checked()"
        [disabled]="disabled()"
        [class]="inputClass()"
        (change)="handleChange($event)"
        (blur)="handleBlur($event)"
        (focus)="handleFocus($event)"
        [attr.aria-describedby]="ariaDescribedBy() || null"
        [attr.aria-label]="ariaLabel() || null"
      />
      <label [for]="inputId" [class]="labelClass()" [attr.aria-hidden]="true">
        <span [class]="radioClass()">
          @if (checked()) {
          <span class="os-radio__dot"></span>
          }
        </span>
        @if (label()) {
        <span class="os-radio__label-text">{{ label() }}</span>
        }
      </label>
    </div>
  `,
  styleUrls: ['./os-radio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OsRadioComponent),
      multi: true,
    },
  ],
})
export class OsRadioComponent implements ControlValueAccessor {
  size = input<OsRadioSize>('medium');
  variant = input<OsRadioVariant>('default');
  name = input<string>('');
  value = input<string>('');
  label = input<string>('');
  checked = input(false);
  disabled = input(false);
  required = input(false);
  ariaDescribedBy = input<string>('');
  ariaLabel = input<string>('');

  radioChange = output<string>();
  radioBlur = output<FocusEvent>();
  radioFocus = output<FocusEvent>();

  protected inputId = `os-radio-${Math.random().toString(36).substr(2, 9)}`;
  private onChange = (value: string) => {};
  private onTouched = () => {};

  containerClass = computed(() => {
    return ['os-radio', `os-radio--${this.size()}`, this.disabled() ? 'os-radio--disabled' : '']
      .filter(Boolean)
      .join(' ');
  });

  inputClass = computed(() => {
    return ['os-radio__input', `os-radio__input--${this.variant()}`].filter(Boolean).join(' ');
  });

  labelClass = computed(() => {
    return ['os-radio__label', this.disabled() ? 'os-radio__label--disabled' : '']
      .filter(Boolean)
      .join(' ');
  });

  radioClass = computed(() => {
    return [
      'os-radio__circle',
      `os-radio__circle--${this.variant()}`,
      `os-radio__circle--${this.size()}`,
      this.checked() ? 'os-radio__circle--checked' : '',
      this.disabled() ? 'os-radio__circle--disabled' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  handleChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;

    this.onChange(value);
    this.radioChange.emit(value);
  }

  handleBlur(event: FocusEvent): void {
    this.onTouched();
    this.radioBlur.emit(event);
  }

  handleFocus(event: FocusEvent): void {
    this.radioFocus.emit(event);
  }

  writeValue(value: string): void {
    // Value is controlled by input signal
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Disabled state is controlled by input signal
  }
}
