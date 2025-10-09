import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OsFormGroupComponent } from '../../molecules/os-form-group/os-form-group.component';

export type OsFormSectionVariant = 'default' | 'card' | 'outlined' | 'minimal';
export type OsFormSectionSize = 'small' | 'medium' | 'large';
export type OsFormSectionTheme = 'light' | 'dark';

export interface FormSectionField {
  id: string;
  label: string;
  type:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'tel'
    | 'url'
    | 'textarea'
    | 'select'
    | 'checkbox'
    | 'radio';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

@Component({
  selector: 'os-form-section',
  imports: [CommonModule, OsFormGroupComponent],
  template: `
    <section [class]="sectionClasses()" [attr.aria-labelledby]="titleId()">
      @if (title()) {
      <header class="os-form-section__header">
        <h2 [id]="titleId()" class="os-form-section__title">
          {{ title() }}
        </h2>
        @if (description()) {
        <p [id]="descriptionId()" class="os-form-section__description">
          {{ description() }}
        </p>
        }
      </header>
      }

      <div class="os-form-section__content">
        @if (fields().length > 0) {
        <os-form-group
          [title]="groupTitle()"
          [description]="groupDescription()"
          [variant]="groupVariant()"
          [size]="size()"
          [required]="required()"
        >
          <ng-content></ng-content>
        </os-form-group>
        } @else {
        <ng-content></ng-content>
        }
      </div>

      @if (actions().length > 0) {
      <footer class="os-form-section__actions">
        <ng-content select="[slot=actions]"></ng-content>
      </footer>
      }
    </section>
  `,
  styleUrl: './os-form-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.role]': '"region"',
    '[attr.aria-labelledby]': 'titleId()',
  },
})
export class OsFormSectionComponent {
  title = input<string>('');
  description = input<string>('');
  groupTitle = input<string>('');
  groupDescription = input<string>('');
  fields = input<FormSectionField[]>([]);
  actions = input<{ label: string; variant?: string; disabled?: boolean }[]>([]);
  variant = input<OsFormSectionVariant>('default');
  size = input<OsFormSectionSize>('medium');
  theme = input<OsFormSectionTheme>('light');
  required = input(false);
  collapsible = input(false);
  collapsed = input(false);

  readonly titleId = computed(
    () => `form-section-title-${Math.random().toString(36).substr(2, 9)}`
  );
  readonly descriptionId = computed(
    () => `form-section-description-${Math.random().toString(36).substr(2, 9)}`
  );

  readonly sectionClasses = computed(() => {
    const classes = ['os-form-section'];

    if (this.variant() !== 'default') {
      classes.push(`os-form-section--${this.variant()}`);
    }

    if (this.size() !== 'medium') {
      classes.push(`os-form-section--${this.size()}`);
    }

    if (this.theme() === 'dark') {
      classes.push('os-form-section--dark');
    }

    if (this.collapsible()) {
      classes.push('os-form-section--collapsible');
    }

    if (this.collapsed()) {
      classes.push('os-form-section--collapsed');
    }

    if (this.actions().length > 0) {
      classes.push('os-form-section--with-actions');
    }

    return classes.join(' ');
  });

  readonly groupVariant = computed(() => {
    const sizeMap: Record<string, 'default' | 'compact' | 'spaced'> = {
      small: 'compact',
      medium: 'default',
      large: 'spaced',
    };
    return sizeMap[this.size()];
  });
}
