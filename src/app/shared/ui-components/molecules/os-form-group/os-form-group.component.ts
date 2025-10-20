import {
  Component,
  input,
  computed,
  inject,
  signal,
  ChangeDetectionStrategy,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

export type OsFormGroupVariant = 'default' | 'compact' | 'spaced';
export type OsFormGroupSize = 'small' | 'medium' | 'large';
export type OsFormGroupColumns = 1 | 2 | 3;

@Component({
  selector: 'os-form-group',
  standalone: true,
  imports: [CommonModule],
  template: `
    <fieldset
      class="os-form-group"
      [class]="formGroupClasses()"
      [attr.data-variant]="variant()"
      [attr.data-size]="size()"
      [attr.data-columns]="effectiveColumns()"
      [attr.disabled]="disabled() ? '' : null"
      [attr.aria-invalid]="invalid()"
      [attr.aria-describedby]="ariaDescribedby()"
      [attr.aria-required]="required()"
    >
      @if (title()) {
      <legend class="os-form-group__title" [id]="legendId()">
        {{ title() }}
      </legend>
      } @if (description()) {
      <div class="os-form-group__description" [id]="descriptionId()">
        {{ description() }}
      </div>
      } @if (invalid() && errorMessage()) {
      <div
        class="os-form-group__error"
        [id]="errorId()"
        role="alert"
        aria-live="polite"
      >
        {{ errorMessage() }}
      </div>
      }

      <div class="os-form-group__content">
        <ng-content></ng-content>
      </div>

      @if (helperText() && !invalid()) {
      <div class="os-form-group__helper" [id]="helperId()">
        {{ helperText() }}
      </div>
      }
    </fieldset>
  `,
  styleUrl: './os-form-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'os-form-group-host',
  },
})
export class OsFormGroupComponent {
  private breakpointObserver = inject(BreakpointObserver);

  title = input<string>('');
  description = input<string>('');
  helperText = input<string>('');
  errorMessage = input<string>('');
  variant = input<OsFormGroupVariant>('default');
  size = input<OsFormGroupSize>('medium');
  columns = input<OsFormGroupColumns>(1);
  required = input<boolean>(false);
  disabled = input<boolean>(false);
  invalid = input<boolean>(false);

  isMobile = signal<boolean>(false);

  legendId = computed(() => `os-form-group-legend-${this.generateId()}`);
  descriptionId = computed(() => `os-form-group-desc-${this.generateId()}`);
  helperId = computed(() => `os-form-group-helper-${this.generateId()}`);
  errorId = computed(() => `os-form-group-error-${this.generateId()}`);

  ariaDescribedby = computed(() => {
    const ids: string[] = [];
    if (this.description()) ids.push(this.descriptionId());
    if (this.invalid() && this.errorMessage()) ids.push(this.errorId());
    if (this.helperText() && !this.invalid()) ids.push(this.helperId());
    return ids.length > 0 ? ids.join(' ') : null;
  });

  effectiveColumns = computed(() => {
    return this.isMobile() ? 1 : this.columns();
  });

  formGroupClasses = computed(() => {
    const classes = ['os-form-group'];

    if (this.variant() !== 'default') {
      classes.push(`os-form-group--${this.variant()}`);
    }

    if (this.size() !== 'medium') {
      classes.push(`os-form-group--${this.size()}`);
    }

    if (this.required()) {
      classes.push('os-form-group--required');
    }

    if (this.disabled()) {
      classes.push('os-form-group--disabled');
    }

    if (this.invalid()) {
      classes.push('os-form-group--invalid');
    }

    if (this.effectiveColumns() > 1) {
      classes.push(`os-form-group--columns-${this.effectiveColumns()}`);
    }

    return classes.join(' ');
  });

  constructor() {
    effect(() => {
      this.breakpointObserver
        .observe([Breakpoints.XSmall, Breakpoints.Small])
        .subscribe((result) => {
          this.isMobile.set(result.matches);
        });
    });
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 11);
  }
}
