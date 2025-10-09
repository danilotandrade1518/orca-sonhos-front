import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
  forwardRef,
  model,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { OsDateInputComponent } from '../../atoms/os-date-input/os-date-input.component';

export type OsDatePickerSize = 'small' | 'medium' | 'large';
export type OsDatePickerVariant = 'default' | 'outlined' | 'filled';

@Component({
  selector: 'os-date-picker',
  standalone: true,
  imports: [CommonModule, FormsModule, OsDateInputComponent],
  template: `
    <div class="os-date-picker" [class]="datePickerClasses()">
      <os-date-input
        [value]="value()"
        [label]="label()"
        [placeholder]="placeholder()"
        [disabled]="disabled()"
        [required]="required()"
        [minDate]="minDate()?.toISOString() || ''"
        [maxDate]="maxDate()?.toISOString() || ''"
        [size]="getInputSize()"
        [helperText]="helperText()"
        [prefixIcon]="calendarIcon()"
        (valueChange)="onValueChange($event)"
        (blurEvent)="onBlur($event)"
        (focusEvent)="onFocus($event)"
      />
    </div>
  `,
  styleUrl: './os-date-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OsDatePickerComponent),
      multi: true,
    },
  ],
  host: {
    class: 'os-date-picker-host',
  },
})
export class OsDatePickerComponent implements ControlValueAccessor {
  value = model<Date | null>(null);
  disabled = model<boolean>(false);

  label = input<string>('');
  placeholder = input<string>('Selecionar data');
  helperText = input<string>('');
  size = input<OsDatePickerSize>('medium');
  variant = input<OsDatePickerVariant>('default');
  required = input<boolean>(false);
  minDate = input<Date | null>(null);
  maxDate = input<Date | null>(null);
  startAt = input<Date | null>(null);
  touchUi = input<boolean>(false);
  opened = input<boolean>(false);
  calendarIcon = input<string>('calendar_today');

  valueChange = output<Date | null>();
  dateChange = output<Date | null>();
  openedChange = output<boolean>();
  monthSelected = output<Date>();
  yearSelected = output<Date>();
  focusEvent = output<FocusEvent>();
  blurEvent = output<FocusEvent>();

  private _onChange = (value: Date | null) => {
    console.debug('onChange called with:', value);
  };
  private _onTouched = () => {
    console.debug('onTouched called');
  };

  // Mapeamento interno para Atoms
  protected getInputSize = () => {
    const sizeMap: Record<OsDatePickerSize, 'small' | 'medium' | 'large'> = {
      small: 'small',
      medium: 'medium',
      large: 'large',
    };
    return sizeMap[this.size()];
  };

  datePickerClasses = () => {
    const classes = ['os-date-picker'];

    if (this.size() !== 'medium') {
      classes.push(`os-date-picker--${this.size()}`);
    }

    if (this.variant() !== 'default') {
      classes.push(`os-date-picker--${this.variant()}`);
    }

    if (this.disabled()) {
      classes.push('os-date-picker--disabled');
    }

    return classes.join(' ');
  };

  onValueChange(value: Date | null): void {
    this.value.set(value);
    this.valueChange.emit(value);
    this.dateChange.emit(value);
    this._onChange(value);
  }

  onBlur(event: FocusEvent): void {
    this.blurEvent.emit(event);
    this._onTouched();
  }

  onFocus(event: FocusEvent): void {
    this.focusEvent.emit(event);
  }

  writeValue(value: Date | null): void {
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
    this.disabled.set(isDisabled);
  }
}
