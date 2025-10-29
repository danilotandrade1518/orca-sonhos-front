import {
  Component,
  input,
  output,
  computed,
  model,
  ChangeDetectionStrategy,
  forwardRef,
  signal,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';

export type OsSliderSize = 'small' | 'medium' | 'large';
export type OsSliderFormat = 'number' | 'currency' | 'percentage';
export type OsSliderRole = 'slider' | 'progressbar';

@Component({
  selector: 'os-slider',
  standalone: true,
  imports: [CommonModule, MatSliderModule],
  template: `
    <div
      [class]="containerClass()"
      [attr.data-animated]="animated()"
      [attr.data-size]="size()"
      [attr.data-format]="format()"
    >
      @if (label()) {
      <label [for]="sliderId" [class]="labelClass()">
        {{ label() }}
        @if (required()) {
        <span class="os-slider__required" aria-label="required">*</span>
        }
      </label>
      }

      <div [class]="sliderWrapperClass()">
        @if (showMinMax()) {
        <span class="os-slider__min-value">{{ formatValue(min()) }}</span>
        }

        <div [class]="sliderTrackClass()">
          <mat-slider
            [id]="sliderId"
            [min]="min()"
            [max]="max()"
            [step]="step()"
            [disabled]="disabled()"
            [class]="sliderClass()"
            [color]="matColor()"
            [discrete]="showValue()"
            [showTickMarks]="showMinMax()"
            (change)="handleInput($event)"
            (blur)="handleBlur($event)"
            (focus)="handleFocus($event)"
            (input)="handleInput($event)"
            [attr.aria-describedby]="computedAriaDescribedBy()"
            [attr.aria-invalid]="hasError()"
            [attr.aria-label]="ariaLabel() || label()"
            [attr.aria-valuenow]="value()"
            [attr.aria-valuemin]="min()"
            [attr.aria-valuemax]="max()"
            [attr.aria-valuetext]="ariaValueText()"
            [attr.role]="sliderRole()"
            [attr.tabindex]="disabled() ? -1 : 0"
          >
            <input
              matSliderThumb
              [value]="value()"
              [min]="min()"
              [max]="max()"
              [step]="step()"
              [disabled]="disabled()"
              [attr.aria-label]="ariaLabel() || label()"
              [attr.aria-valuenow]="value()"
              [attr.aria-valuemin]="min()"
              [attr.aria-valuemax]="max()"
            />
          </mat-slider>

          @if (showValue()) {
          <div [class]="valueDisplayClass()" [attr.aria-live]="ariaLive()">
            {{ displayValue() }}
          </div>
          } @if (showTooltip()) {
          <div [class]="tooltipClass()" [attr.aria-hidden]="true">
            {{ formatValue(value()) }}
          </div>
          }
        </div>

        @if (showMinMax()) {
        <span class="os-slider__max-value">{{ formatValue(max()) }}</span>
        }
      </div>

      @if (helperText() || hasError()) {
      <div
        [id]="sliderId + '-helper'"
        [class]="helperClass()"
        [attr.aria-live]="hasError() ? 'assertive' : 'polite'"
      >
        {{ errorMessage() || helperText() }}
      </div>
      }
    </div>
  `,
  styleUrls: ['./os-slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OsSliderComponent),
      multi: true,
    },
  ],
})
export class OsSliderComponent implements ControlValueAccessor {
  size = input<OsSliderSize>('medium');
  label = input<string>('');
  helperText = input<string>('');
  errorMessage = input<string>('');
  disabled = model(false);
  required = input(false);
  value = model<number>(0);
  min = input<number>(0);
  max = input<number>(100);
  step = input<number>(1);
  showValue = input(true);
  showMinMax = input(false);
  showTooltip = input(false);
  ariaLabel = input<string>('');
  ariaDescribedBy = input<string>('');
  format = input<OsSliderFormat>('number');
  currency = input<string>('BRL');
  decimals = input<number>(2);
  animated = input(true);
  role = input<OsSliderRole>('slider');
  hapticFeedback = input(true);

  valueChange = output<number>();
  blurEvent = output<FocusEvent>();
  focusEvent = output<FocusEvent>();
  rangeChange = output<{ min: number; max: number }>();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _onChange = (value: number) => {};
  private _onTouched = () => {};

  sliderId = `os-slider-${Math.random().toString(36).substr(2, 9)}`;
  isFocused = signal(false);
  isHovered = signal(false);

  constructor() {
    effect(() => {
      const minValue = this.min();
      const maxValue = this.max();
      this.rangeChange.emit({ min: minValue, max: maxValue });
    });
  }

  containerClass = computed(() => {
    return [
      'os-slider-container',
      `os-slider-container--${this.size()}`,
      this.hasError() ? 'os-slider-container--error' : '',
      this.disabled() ? 'os-slider-container--disabled' : '',
      this.isFocused() ? 'os-slider-container--focused' : '',
      this.isHovered() ? 'os-slider-container--hovered' : '',
      this.animated() ? 'os-slider-container--animated' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  labelClass = computed(() => {
    return ['os-slider__label', this.required() ? 'os-slider__label--required' : '']
      .filter(Boolean)
      .join(' ');
  });

  sliderWrapperClass = computed(() => {
    return ['os-slider__wrapper', this.showMinMax() ? 'os-slider__wrapper--with-labels' : '']
      .filter(Boolean)
      .join(' ');
  });

  sliderTrackClass = computed(() => {
    return ['os-slider__track', this.showValue() ? 'os-slider__track--with-value' : '']
      .filter(Boolean)
      .join(' ');
  });

  sliderClass = computed(() => {
    return [
      'os-slider',
      `os-slider--${this.size()}`,
      this.hasError() ? 'os-slider--error' : '',
      this.disabled() ? 'os-slider--disabled' : '',
      this.isFocused() ? 'os-slider--focused' : '',
      this.isHovered() ? 'os-slider--hovered' : '',
      this.animated() ? 'os-slider--animated' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  valueDisplayClass = computed(() => {
    return [
      'os-slider__value-display',
      `os-slider__value-display--${this.size()}`,
      this.animated() ? 'os-slider__value-display--animated' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  tooltipClass = computed(() => {
    return [
      'os-slider__tooltip',
      `os-slider__tooltip--${this.size()}`,
      this.animated() ? 'os-slider__tooltip--animated' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  helperClass = computed(() => {
    return ['os-slider__helper', this.hasError() ? 'os-slider__helper--error' : '']
      .filter(Boolean)
      .join(' ');
  });

  hasError = computed(() => {
    return !!this.errorMessage();
  });

  displayValue = computed(() => {
    return this.formatValue(this.value());
  });

  sliderRole = computed(() => {
    return this.role();
  });

  ariaValueText = computed(() => {
    const formattedValue = this.formatValue(this.value());
    const minFormatted = this.formatValue(this.min());
    const maxFormatted = this.formatValue(this.max());
    return `${formattedValue} de ${minFormatted} a ${maxFormatted}`;
  });

  ariaLive = computed(() => {
    return this.showValue() ? 'polite' : 'off';
  });

  computedAriaDescribedBy = computed(() => {
    const helperId = this.helperText() ? this.sliderId + '-helper' : null;
    const describedBy = this.ariaDescribedBy();
    return describedBy || helperId;
  });

  protected matColor = computed(() => {
    if (this.hasError()) {
      return 'warn';
    }
    return 'primary';
  });

  formatValue(value: number): string {
    const format = this.format();
    const decimals = this.decimals();
    const currency = this.currency();

    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: currency,
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }).format(value);
      case 'percentage':
        return new Intl.NumberFormat('pt-BR', {
          style: 'percent',
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }).format(value / 100);
      default:
        return new Intl.NumberFormat('pt-BR', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }).format(value);
    }
  }

  triggerHapticFeedback(): void {
    if (this.hapticFeedback() && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }

  handleInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newValue = target?.value ? Number(target.value) : this.value();

    this.triggerHapticFeedback();
    this._onChange(newValue);
    this.valueChange.emit(newValue);
  }

  handleBlur(event: FocusEvent): void {
    this.isFocused.set(false);
    this._onTouched();
    this.blurEvent.emit(event);
  }

  handleFocus(event: FocusEvent): void {
    this.isFocused.set(true);
    this.focusEvent.emit(event);
  }

  writeValue(value: number): void {
    if (value !== this.value()) {
      this.value.set(value);
    }
  }

  registerOnChange(fn: (value: number) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
