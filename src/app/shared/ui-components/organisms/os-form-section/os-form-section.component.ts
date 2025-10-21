import {
  Component,
  input,
  computed,
  ChangeDetectionStrategy,
  signal,
  effect,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { OsFormGroupComponent } from '../../molecules/os-form-group/os-form-group.component';
import { OsIconComponent } from '../../atoms/os-icon/os-icon.component';
import { BreakpointObserver } from '@angular/cdk/layout';

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

export interface FormSectionValidation {
  isValid: boolean;
  errors: string[];
  touched: boolean;
  dirty: boolean;
}

@Component({
  selector: 'os-form-section',
  imports: [CommonModule, OsFormGroupComponent, OsIconComponent],
  template: `
    <section
      [class]="sectionClasses()"
      [attr.aria-labelledby]="titleId()"
      [attr.aria-describedby]="ariaDescribedby()"
      [attr.aria-expanded]="collapsible() ? !collapsed() : null"
      [attr.aria-hidden]="collapsible() && collapsed() ? 'true' : null"
    >
      @if (title()) {
      <header class="os-form-section__header">
        <h2 [id]="titleId()" class="os-form-section__title">
          {{ title() }}
          @if (required()) {
          <span class="os-form-section__required" aria-label="obrigatório">*</span>
          }
        </h2>
        @if (description()) {
        <p [id]="descriptionId()" class="os-form-section__description">
          {{ description() }}
        </p>
        } @if (collapsible()) {
        <button
          type="button"
          class="os-form-section__toggle"
          [attr.aria-expanded]="!collapsed()"
          [attr.aria-controls]="contentId()"
          (click)="toggleCollapsed()"
          (keydown.enter)="toggleCollapsed()"
          (keydown.space)="toggleCollapsed()"
        >
          <os-icon
            [name]="collapsed() ? 'expand_more' : 'expand_less'"
            size="md"
            [attr.aria-hidden]="true"
          />
          <span class="os-form-section__toggle-text">
            {{ collapsed() ? 'Expandir' : 'Recolher' }}
          </span>
        </button>
        }
      </header>
      }

      <div
        [id]="contentId()"
        class="os-form-section__content"
        [attr.aria-hidden]="collapsible() && collapsed() ? 'true' : null"
      >
        @if (fields().length > 0) {
        <os-form-group
          [title]="groupTitle()"
          [description]="groupDescription()"
          [variant]="groupVariant()"
          [size]="size()"
          [required]="required()"
          [invalid]="validation()?.isValid === false"
          [errorMessage]="validation()?.errors?.join(', ') || ''"
        >
          <ng-content></ng-content>
        </os-form-group>
        } @else {
        <ng-content></ng-content>
        } @if (validation() && !validation()?.isValid && validation()?.touched) {
        <div class="os-form-section__validation" role="alert" [attr.aria-live]="'polite'">
          <os-icon name="error" size="sm" />
          <span>{{ validation()?.errors?.join(', ') || '' }}</span>
        </div>
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
    '[attr.aria-describedby]': 'ariaDescribedby()',
    '[attr.aria-expanded]': 'collapsible() ? (!collapsed()) : null',
    '[attr.aria-hidden]': 'collapsible() && collapsed() ? "true" : null',
  },
})
export class OsFormSectionComponent {
  private readonly breakpointObserver = inject(BreakpointObserver);

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
  validation = input<FormSectionValidation | null>(null);
  hapticFeedback = input(true);
  animated = input(true);

  private readonly _collapsed = signal(false);
  private readonly _isMobile = signal(false);

  readonly isMobile = this._isMobile.asReadonly();

  readonly titleId = computed(
    () => `form-section-title-${Math.random().toString(36).substr(2, 9)}`
  );
  readonly descriptionId = computed(
    () => `form-section-description-${Math.random().toString(36).substr(2, 9)}`
  );
  readonly contentId = computed(
    () => `form-section-content-${Math.random().toString(36).substr(2, 9)}`
  );

  readonly ariaDescribedby = computed(() => {
    const ids = [];
    if (this.description()) ids.push(this.descriptionId());
    if (this.groupDescription()) ids.push(`group-${this.descriptionId()}`);
    return ids.length > 0 ? ids.join(' ') : null;
  });

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

    if (this.collapsed() || this._collapsed()) {
      classes.push('os-form-section--collapsed');
    }

    if (this.actions().length > 0) {
      classes.push('os-form-section--with-actions');
    }

    if (this.isMobile()) {
      classes.push('os-form-section--mobile');
    }

    if (this.validation() && !this.validation()?.isValid) {
      classes.push('os-form-section--invalid');
    }

    if (this.animated()) {
      classes.push('os-form-section--animated');
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

  constructor() {
    effect(() => {
      this._collapsed.set(this.collapsed());
    });

    this.breakpointObserver.observe('(max-width: 768px)').subscribe((result) => {
      this._isMobile.set(result.matches);
    });
  }

  toggleCollapsed(): void {
    if (!this.collapsible()) return;

    this._collapsed.update((current) => !current);

    if (this.hapticFeedback() && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }
}
