import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type OsFormGroupVariant = 'default' | 'compact' | 'spaced';
export type OsFormGroupSize = 'small' | 'medium' | 'large';

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
    >
      @if (title()) {
      <legend class="os-form-group__title">{{ title() }}</legend>
      } @if (description()) {
      <div class="os-form-group__description">{{ description() }}</div>
      }

      <div class="os-form-group__content">
        <ng-content></ng-content>
      </div>

      @if (helperText()) {
      <div class="os-form-group__helper">{{ helperText() }}</div>
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
  title = input<string>('');
  description = input<string>('');
  helperText = input<string>('');
  variant = input<OsFormGroupVariant>('default');
  size = input<OsFormGroupSize>('medium');
  required = input<boolean>(false);

  formGroupClasses = () => {
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

    return classes.join(' ');
  };
}
