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

export type OsSliderSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'os-slider',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="containerClass()">
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
        <span class="os-slider__min-value">{{ min() }}</span>
        }

        <div [class]="sliderTrackClass()">
          <input
            [id]="sliderId"
            type="range"
            [min]="min()"
            [max]="max()"
            [step]="step()"
            [disabled]="disabled()"
            [required]="required()"
            [value]="value()"
            [class]="sliderClass()"
            (input)="handleInput($event)"
            (blur)="handleBlur($event)"
            (focus)="handleFocus($event)"
            [attr.aria-describedby]="helperText() ? sliderId + '-helper' : null"
            [attr.aria-invalid]="hasError()"
            [attr.aria-label]="ariaLabel() || label()"
          />

          @if (showValue()) {
          <div [class]="valueDisplayClass()">
            {{ displayValue() }}
          </div>
          }
        </div>

        @if (showMinMax()) {
        <span class="os-slider__max-value">{{ max() }}</span>
        }
      </div>

      @if (helperText() || hasError()) {
      <div [id]="sliderId + '-helper'" [class]="helperClass()">
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
  disabled = input(false);
  required = input(false);
  value = input<number>(0);
  min = input<number>(0);
  max = input<number>(100);
  step = input<number>(1);
  showValue = input(true);
  showMinMax = input(false);
  ariaLabel = input<string>('');

  valueChange = output<number>();
  blur = output<FocusEvent>();
  focus = output<FocusEvent>();

  private _onChange = (value: number) => {};
  private _onTouched = () => {};

  sliderId = `os-slider-${Math.random().toString(36).substr(2, 9)}`;

  containerClass = computed(() => {
    return [
      'os-slider-container',
      `os-slider-container--${this.size()}`,
      this.hasError() ? 'os-slider-container--error' : '',
      this.disabled() ? 'os-slider-container--disabled' : '',
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
    ]
      .filter(Boolean)
      .join(' ');
  });

  valueDisplayClass = computed(() => {
    return ['os-slider__value-display', `os-slider__value-display--${this.size()}`]
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
    return this.value().toString();
  });

  handleInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newValue = parseFloat(target.value);

    this._onChange(newValue);
    this.valueChange.emit(newValue);
  }

  handleBlur(event: FocusEvent): void {
    this._onTouched();
    this.blur.emit(event);
  }

  handleFocus(event: FocusEvent): void {
    this.focus.emit(event);
  }

  writeValue(value: number): void {
    // Value is controlled by input signal
  }

  registerOnChange(fn: (value: number) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {}
}
