import { Component, input, output, computed, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';

import { OsButtonComponent } from '../../atoms/os-button/os-button.component';
import { OsCardComponent } from '../../molecules/os-card/os-card.component';
import { OsProgressBarComponent } from '../../atoms/os-progress-bar/os-progress-bar.component';
import { OsPageHeaderComponent } from '../../organisms/os-page-header/os-page-header.component';

export interface FormTemplateConfig {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backUrl?: string;
  showSaveButton?: boolean;
  showCancelButton?: boolean;
  saveButtonText?: string;
  cancelButtonText?: string;
  showProgress?: boolean;
  progressValue?: number;
  showActions?: boolean;
  actions?: {
    label: string;
    variant: 'primary' | 'secondary' | 'tertiary' | 'danger';
    size: 'small' | 'medium' | 'large';
    disabled?: boolean;
    loading?: boolean;
    icon?: string;
    ariaLabel?: string;
  }[];
}

@Component({
  selector: 'os-form-template',
  template: `
    <div
      [class]="templateClass()"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-describedby]="ariaDescribedBy()"
      role="main"
    >
      @if (showHeader()) {
      <os-page-header
        [variant]="headerVariant()"
        [size]="size()"
        [title]="config().title"
        [subtitle]="config().subtitle || null"
        [actions]="headerActions()"
      />
      }

      <div class="os-form-template__content">
        <os-card [variant]="cardVariant()" [size]="size()" [class]="cardClass()">
          @if (showProgress() && progressValue() !== undefined) {
          <div
            class="os-form-template__progress"
            role="progressbar"
            [attr.aria-valuenow]="progressValue()"
            [attr.aria-valuemin]="0"
            [attr.aria-valuemax]="100"
            [attr.aria-label]="progressAriaLabel()"
          >
            <os-progress-bar
              [variant]="'primary'"
              [size]="size()"
              [value]="progressValue()"
              [label]="progressLabel()"
            />
          </div>
          }

          <div
            class="os-form-template__form"
            [attr.aria-label]="formAriaLabel()"
            [attr.aria-describedby]="formAriaDescribedBy()"
          >
            <ng-content />
          </div>

          @if (showActions()) {
          <div
            class="os-form-template__actions"
            role="toolbar"
            [attr.aria-label]="actionsAriaLabel()"
          >
            @if (config().showCancelButton) {
            <os-button
              [variant]="'secondary'"
              [size]="size()"
              [disabled]="disabled()"
              [ariaLabel]="cancelAriaLabel()"
              (click)="cancelClick.emit()"
            >
              {{ config().cancelButtonText || 'Cancelar' }}
            </os-button>
            } @if (config().showSaveButton) {
            <os-button
              [variant]="'primary'"
              [size]="size()"
              [disabled]="disabled() || !isFormValid()"
              [loading]="loading()"
              [ariaLabel]="saveAriaLabel()"
              (click)="save.emit()"
            >
              {{ config().saveButtonText || 'Salvar' }}
            </os-button>
            } @for (action of config().actions; track action.label) {
            <os-button
              [variant]="action.variant"
              [size]="action.size"
              [disabled]="action.disabled || disabled()"
              [loading]="action.loading || false"
              [icon]="action.icon || ''"
              [ariaLabel]="action.ariaLabel || action.label"
              (click)="actionClick.emit(action)"
            >
              {{ action.label }}
            </os-button>
            }
          </div>
          }
        </os-card>
      </div>
    </div>
  `,
  styleUrls: ['./os-form-template.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    OsButtonComponent,
    OsCardComponent,
    OsProgressBarComponent,
    OsPageHeaderComponent,
  ],
})
export class OsFormTemplateComponent {
  config = input.required<FormTemplateConfig>();
  size = input<'small' | 'medium' | 'large'>('medium');
  variant = input<'default' | 'compact' | 'detailed'>('default');
  theme = input<'light' | 'dark'>('light');
  disabled = input(false);
  loading = input(false);
  form = input<FormGroup | null>(null);
  showHeader = input(true);
  showProgress = input(true);
  showActions = input(true);
  ariaLabel = input<string>();
  ariaDescribedBy = input<string>();

  save = output<void>();
  cancelClick = output<void>();
  actionClick = output<{
    label: string;
    variant: 'primary' | 'secondary' | 'tertiary' | 'danger';
    size: 'small' | 'medium' | 'large';
    disabled?: boolean;
    loading?: boolean;
    icon?: string;
    ariaLabel?: string;
  }>();

  private uniqueId = signal(Math.random().toString(36).substr(2, 9));

  protected templateClass = computed(() => {
    return [
      'os-form-template',
      `os-form-template--${this.variant()}`,
      `os-form-template--${this.size()}`,
      `os-form-template--${this.theme()}`,
      this.disabled() ? 'os-form-template--disabled' : '',
      this.loading() ? 'os-form-template--loading' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  protected cardClass = computed(() => {
    return ['os-form-template__card', `os-form-template__card--${this.variant()}`]
      .filter(Boolean)
      .join(' ');
  });

  protected headerVariant = computed(() => {
    const variant = this.variant();
    return variant === 'compact' ? 'compact' : 'default';
  });

  protected cardVariant = computed(() => {
    const variant = this.variant();
    return variant === 'detailed' ? 'elevated' : 'default';
  });

  protected headerActions = computed(() => {
    if (!this.showHeader()) return [];

    const actions = [];

    if (this.config().showBackButton && this.config().backUrl) {
      actions.push({
        label: 'Voltar',
        variant: 'secondary' as const,
        size: this.size(),
        icon: 'arrow-left',
      });
    }

    return actions;
  });

  protected progressValue = computed(() => {
    return this.config().progressValue || 0;
  });

  protected isFormValid = computed(() => {
    const form = this.form();
    return form ? form.valid : true;
  });

  protected progressLabel = computed(() => {
    const value = this.progressValue();
    return `Progresso: ${value}%`;
  });

  protected progressAriaLabel = computed(() => {
    const value = this.progressValue();
    return `Progresso do formulário: ${value}%`;
  });

  protected formAriaLabel = computed(() => {
    return this.ariaLabel() || `Formulário: ${this.config().title}`;
  });

  protected formAriaDescribedBy = computed(() => {
    const describedBy = this.ariaDescribedBy();
    const subtitle = this.config().subtitle;

    if (describedBy) return describedBy;
    if (subtitle) return `${this.uniqueId()}-subtitle`;
    return undefined;
  });

  protected actionsAriaLabel = computed(() => {
    return `Ações do formulário: ${this.config().title}`;
  });

  protected cancelAriaLabel = computed(() => {
    return this.config().cancelButtonText || 'Cancelar';
  });

  protected saveAriaLabel = computed(() => {
    const baseLabel = this.config().saveButtonText || 'Salvar';
    const isValid = this.isFormValid();
    const loading = this.loading();

    if (loading) {
      return `${baseLabel} - Salvando...`;
    }

    if (!isValid) {
      return `${baseLabel} - Preencha todos os campos obrigatórios`;
    }

    return baseLabel;
  });
}
