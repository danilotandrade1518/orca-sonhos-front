import { Component, input, output, ChangeDetectionStrategy, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type OsDatePickerSize = 'small' | 'medium' | 'large';
export type OsDatePickerVariant = 'default' | 'outlined' | 'filled';

@Component({
  selector: 'os-date-picker',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  template: `
    <div class="os-date-picker" [class]="datePickerClasses()">
      <mat-form-field [appearance]="appearance()" [class]="formFieldClass()">
        <mat-label>{{ label() }}</mat-label>
        <input
          matInput
          [matDatepicker]="picker"
          [value]="value()"
          [placeholder]="placeholder()"
          [disabled]="disabled()"
          [required]="required()"
          [min]="minDate()"
          [max]="maxDate()"
          (dateChange)="onDateChange($event)"
          (blur)="onBlur($event)"
          (focus)="onFocus($event)"
          [attr.aria-describedby]="helperText() ? inputId + '-helper' : null"
        />
        <mat-datepicker-toggle matSuffix [for]="picker" [disabled]="disabled()">
          <mat-icon matDatepickerToggleIcon>{{ calendarIcon() }}</mat-icon>
        </mat-datepicker-toggle>
        @if (helperText()) {
        <mat-hint>{{ helperText() }}</mat-hint>
        }
      </mat-form-field>

      <mat-datepicker
        #picker
        [startAt]="startAt()"
        [touchUi]="touchUi()"
        [opened]="opened()"
        [disabled]="disabled()"
        [dateClass]="dateClass"
        (openedChange)="handleOpenedChange($event)"
        (monthSelected)="onMonthSelected($event)"
        (yearSelected)="onYearSelected($event)"
      ></mat-datepicker>
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
  value = input<Date | null>(null);
  label = input<string>('');
  placeholder = input<string>('Selecionar data');
  helperText = input<string>('');
  size = input<OsDatePickerSize>('medium');
  variant = input<OsDatePickerVariant>('default');
  disabled = input<boolean>(false);
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
  focus = output<FocusEvent>();
  blur = output<FocusEvent>();

  protected inputId = `os-date-picker-${Math.random().toString(36).substr(2, 9)}`;

  private _onChange = (value: Date | null) => {};
  private _onTouched = () => {};

  protected appearance = () => {
    const variantMap: Record<OsDatePickerVariant, 'outline' | 'fill'> = {
      default: 'outline',
      outlined: 'outline',
      filled: 'fill',
    };
    return variantMap[this.variant()];
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

  formFieldClass = () => {
    const classes = ['os-date-picker__field'];

    if (this.size() !== 'medium') {
      classes.push(`os-date-picker__field--${this.size()}`);
    }

    return classes.join(' ');
  };

  dateClass = (date: Date): string => {
    const classes = ['os-date-picker__date'];

    if (this.minDate() && date < this.minDate()!) {
      classes.push('os-date-picker__date--disabled');
    }

    if (this.maxDate() && date > this.maxDate()!) {
      classes.push('os-date-picker__date--disabled');
    }

    return classes.join(' ');
  };

  onDateChange(event: any): void {
    const date = event.value;
    this.valueChange.emit(date);
    this.dateChange.emit(date);
    this._onChange(date);
  }

  handleOpenedChange(event: any): void {
    this.onOpenedChange(event);
  }

  onOpenedChange(opened: boolean): void {
    this.openedChange.emit(opened);
  }

  onMonthSelected(date: Date): void {
    this.monthSelected.emit(date);
  }

  onYearSelected(date: Date): void {
    this.yearSelected.emit(date);
  }

  onFocus(event: FocusEvent): void {
    this.focus.emit(event);
  }

  onBlur(event: FocusEvent): void {
    this._onTouched();
    this.blur.emit(event);
  }

  // ControlValueAccessor implementation
  writeValue(value: Date | null): void {
    // Value is handled by input signal
  }

  registerOnChange(fn: (value: Date | null) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Disabled state is handled by input signal
  }
}
