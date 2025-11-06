import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
  forwardRef,
  model,
  computed,
  signal,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { OsDateInputComponent } from '../../atoms/os-date-input/os-date-input.component';
import { OsButtonComponent } from '../../atoms/os-button/os-button.component';

export type OsDatePickerSize = 'small' | 'medium' | 'large';
export type OsDatePickerVariant = 'default' | 'outlined' | 'filled';
export type OsDatePickerRole = 'presentation' | 'dialog' | 'group';

export interface QuickDateOption {
  label: string;
  getValue: () => Date;
  ariaLabel?: string;
}

@Component({
  selector: 'os-date-picker',
  standalone: true,
  imports: [CommonModule, FormsModule, OsDateInputComponent, OsButtonComponent],
  template: `
    <div class="os-date-picker" [class]="datePickerClasses()" [attr.role]="role()">
      <!-- Quick Selection Buttons -->
      @if (showQuickSelection() && quickDateOptions().length > 0) {
      <div class="os-date-picker__quick-selection" role="group" aria-label="Seleção rápida de data">
        @for (option of quickDateOptions(); track option.label) {
        <os-button
          variant="tertiary"
          size="small"
          [ariaLabel]="option.ariaLabel || 'Selecionar ' + option.label"
          (click)="selectQuickDate(option)"
          [disabled]="disabled()"
        >
          {{ option.label }}
        </os-button>
        }
      </div>
      }

      <!-- Date Input Field -->
      <os-date-input
        [value]="value()"
        [label]="label()"
        [placeholder]="placeholder()"
        [disabled]="disabled()"
        [required]="required()"
        [minDate]="minDate()?.toISOString() || ''"
        [maxDate]="maxDate()?.toISOString() || ''"
        [size]="getInputSize()"
        [helperText]="effectiveHelperText()"
        [prefixIcon]="calendarIcon()"
        [ariaLabel]="ariaLabel()"
        [ariaDescribedBy]="ariaDescribedBy()"
        (valueChange)="onValueChange($event)"
        (blurEvent)="onBlur($event)"
        (focusEvent)="onFocus($event)"
      />

      <!-- Range End Date (for range picker) -->
      @if (isRangePicker() && showRangeEnd()) {
      <div class="os-date-picker__range-separator" aria-hidden="true">até</div>
      <os-date-input
        [value]="endDate()"
        [label]="endDateLabel()"
        [placeholder]="endDatePlaceholder()"
        [disabled]="disabled()"
        [required]="required()"
        [minDate]="value()?.toISOString() || minDate()?.toISOString() || ''"
        [maxDate]="maxDate()?.toISOString() || ''"
        [size]="getInputSize()"
        [helperText]="endDateHelperText()"
        [prefixIcon]="calendarIcon()"
        [ariaLabel]="endDateAriaLabel()"
        (valueChange)="onEndDateChange($event)"
        (blurEvent)="onEndDateBlur($event)"
        (focusEvent)="onEndDateFocus($event)"
      />
      }

      <!-- Today Indicator -->
      @if (showTodayIndicator() && isToday(value())) {
      <div class="os-date-picker__today-indicator" role="status" aria-live="polite">
        <span class="os-date-picker__today-text">Hoje</span>
      </div>
      }
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
    '[attr.data-mobile-friendly]': 'mobileFriendly()',
    '[attr.data-has-quick-selection]': 'showQuickSelection()',
  },
})
export class OsDatePickerComponent implements ControlValueAccessor {
  value = model<Date | null>(null);
  disabled = model<boolean>(false);
  endDate = signal<Date | null>(null);

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

  mobileFriendly = input<boolean>(true);
  showQuickSelection = input<boolean>(false);
  showTodayIndicator = input<boolean>(true);
  isRangePicker = input<boolean>(false);
  showRangeEnd = input<boolean>(false);
  endDateLabel = input<string>('Data final');
  endDatePlaceholder = input<string>('Selecionar data final');
  endDateHelperText = input<string>('');
  role = input<OsDatePickerRole>('group');

  quickDateOptions = signal<QuickDateOption[]>([]);

  ariaLabel = input<string>('');
  ariaDescribedBy = input<string>('');
  endDateAriaLabel = input<string>('');

  valueChange = output<Date | null>();
  dateChange = output<Date | null>();
  openedChange = output<boolean>();
  monthSelected = output<Date>();
  yearSelected = output<Date>();
  focusEvent = output<FocusEvent>();
  blurEvent = output<FocusEvent>();
  endDateChange = output<Date | null>();
  endDateFocusEvent = output<FocusEvent>();
  endDateBlurEvent = output<FocusEvent>();
  quickDateSelected = output<QuickDateOption>();

  effectiveHelperText = computed(() => {
    const helper = this.helperText();
    if (helper) return helper;

    const format = this.getDateFormat();
    return `Formato: ${format}`;
  });

  datePickerClasses = computed(() => {
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

    if (this.mobileFriendly()) {
      classes.push('os-date-picker--mobile-friendly');
    }

    if (this.isRangePicker()) {
      classes.push('os-date-picker--range');
    }

    if (this.showQuickSelection()) {
      classes.push('os-date-picker--with-quick-selection');
    }

    return classes.join(' ');
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _onChange = (value: Date | null) => {};
  private _onTouched = () => {};

  constructor() {
    effect(() => {
      if (this.showQuickSelection() && this.quickDateOptions().length === 0) {
        this.quickDateOptions.set(this.getDefaultQuickDateOptions());
      }
    });
  }

  selectQuickDate(option: QuickDateOption): void {
    if (this.disabled()) return;

    const date = option.getValue();
    this.onValueChange(date);
    this.quickDateSelected.emit(option);
  }

  isToday(date: Date | null): boolean {
    if (!date) return false;

    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  getInputSize(): 'small' | 'medium' | 'large' {
    const sizeMap: Record<OsDatePickerSize, 'small' | 'medium' | 'large'> = {
      small: 'small',
      medium: 'medium',
      large: 'large',
    };
    return sizeMap[this.size()];
  }

  getDateFormat(): string {
    return 'DD/MM/AAAA';
  }

  getDefaultQuickDateOptions(): QuickDateOption[] {
    return [
      {
        label: 'Hoje',
        getValue: () => new Date(),
        ariaLabel: 'Selecionar data de hoje',
      },
      {
        label: 'Amanhã',
        getValue: () => {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          return tomorrow;
        },
        ariaLabel: 'Selecionar data de amanhã',
      },
      {
        label: 'Próxima Semana',
        getValue: () => {
          const nextWeek = new Date();
          nextWeek.setDate(nextWeek.getDate() + 7);
          return nextWeek;
        },
        ariaLabel: 'Selecionar data da próxima semana',
      },
      {
        label: 'Próximo Mês',
        getValue: () => {
          const nextMonth = new Date();
          nextMonth.setMonth(nextMonth.getMonth() + 1);
          return nextMonth;
        },
        ariaLabel: 'Selecionar data do próximo mês',
      },
    ];
  }

  onValueChange(value: Date | null): void {
    this.value.set(value);
    this.valueChange.emit(value);
    this.dateChange.emit(value);
    this._onChange(value);
  }

  onEndDateChange(value: Date | null): void {
    this.endDate.set(value);
    this.endDateChange.emit(value);
  }

  onBlur(event: FocusEvent): void {
    this.blurEvent.emit(event);
    this._onTouched();
  }

  onFocus(event: FocusEvent): void {
    this.focusEvent.emit(event);
  }

  onEndDateBlur(event: FocusEvent): void {
    this.endDateBlurEvent.emit(event);
    this._onTouched();
  }

  onEndDateFocus(event: FocusEvent): void {
    this.endDateFocusEvent.emit(event);
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
