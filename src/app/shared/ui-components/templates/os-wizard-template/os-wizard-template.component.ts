import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { OsButtonComponent } from '../../atoms/os-button/os-button.component';
import { OsCardComponent } from '../../molecules/os-card/os-card.component';
import { OsProgressBarComponent } from '../../atoms/os-progress-bar/os-progress-bar.component';
import { OsPageHeaderComponent } from '../../organisms/os-page-header/os-page-header.component';
import { OsIconComponent } from '../../atoms/os-icon/os-icon.component';
import { OsBadgeComponent } from '../../atoms/os-badge/os-badge.component';

export interface WizardStep {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  icon?: string;
  completed?: boolean;
  disabled?: boolean;
  optional?: boolean;
}

export interface WizardTemplateConfig {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backUrl?: string;
  showNextButton?: boolean;
  showPreviousButton?: boolean;
  showFinishButton?: boolean;
  nextButtonText?: string;
  previousButtonText?: string;
  finishButtonText?: string;
  showProgress?: boolean;
  showStepNumbers?: boolean;
  showStepIcons?: boolean;
  allowSkipSteps?: boolean;
  showStepValidation?: boolean;
  steps: WizardStep[];
}

@Component({
  selector: 'os-wizard-template',
  template: `
    <div [class]="templateClass()">
      @if (showHeader()) {
      <os-page-header
        [variant]="headerVariant()"
        [size]="size()"
        [title]="config().title"
        [subtitle]="config().subtitle || null"
        [actions]="headerActions()"
      />
      }

      <div class="os-wizard-template__content">
        @if (showProgress()) {
        <div class="os-wizard-template__progress">
          <os-progress-bar
            [variant]="'primary'"
            [size]="size()"
            [value]="progressValue()"
            [label]="'Passo ' + (currentStepIndex() + 1) + ' de ' + totalSteps()"
          />
        </div>
        } @if (showStepNavigation()) {
        <div class="os-wizard-template__steps">
          @for (step of config().steps; track step.id; let i = $index) {
          <div
            [class]="stepClass(step, i)"
            [attr.aria-current]="i === currentStepIndex() ? 'step' : null"
            [attr.aria-disabled]="step.disabled || false"
            [tabindex]="step.disabled ? -1 : 0"
            role="button"
            (click)="onStepClick(step, i)"
            (keydown.enter)="onStepClick(step, i)"
            (keydown.space)="onStepClick(step, i)"
          >
            @if (showStepNumbers()) {
            <div class="os-wizard-template__step-number">
              @if (step.completed) {
              <os-icon name="check" [size]="iconSize()" />
              } @else {
              <span class="os-wizard-template__step-number-text">{{ i + 1 }}</span>
              }
            </div>
            } @if (showStepIcons() && step.icon) {
            <div class="os-wizard-template__step-icon">
              <os-icon [name]="step.icon" [size]="iconSize()" />
            </div>
            }

            <div class="os-wizard-template__step-content">
              <h3 class="os-wizard-template__step-title">{{ step.title }}</h3>
              @if (step.subtitle) {
              <p class="os-wizard-template__step-subtitle">{{ step.subtitle }}</p>
              } @if (step.description) {
              <p class="os-wizard-template__step-description">{{ step.description }}</p>
              }
            </div>

            @if (step.optional) {
            <os-badge variant="secondary" [size]="badgeSize()">Opcional</os-badge>
            }
          </div>
          }
        </div>
        }

        <os-card [variant]="cardVariant()" [size]="size()" [class]="cardClass()">
          <div class="os-wizard-template__step-content">
            <ng-content />
          </div>

          @if (showActions()) {
          <div class="os-wizard-template__actions">
            @if (showPreviousButton() && currentStepIndex() > 0) {
            <os-button
              [variant]="'secondary'"
              [size]="size()"
              [disabled]="disabled()"
              (click)="previous.emit()"
            >
              {{ config().previousButtonText || 'Anterior' }}
            </os-button>
            } @if (showNextButton() && !isLastStep()) {
            <os-button
              [variant]="'primary'"
              [size]="size()"
              [disabled]="disabled() || !isCurrentStepValid()"
              [loading]="loading()"
              (click)="next.emit()"
            >
              {{ config().nextButtonText || 'Próximo' }}
            </os-button>
            } @if (showFinishButton() && isLastStep()) {
            <os-button
              [variant]="'primary'"
              [size]="size()"
              [disabled]="disabled() || !isCurrentStepValid()"
              [loading]="loading()"
              (click)="finishWizard.emit()"
            >
              {{ config().finishButtonText || 'Finalizar' }}
            </os-button>
            } @if (allowSkipSteps() && !isLastStep()) {
            <os-button
              [variant]="'tertiary'"
              [size]="size()"
              [disabled]="disabled()"
              (click)="skip.emit()"
            >
              Pular
            </os-button>
            }
          </div>
          }
        </os-card>
      </div>
    </div>
  `,
  styleUrls: ['./os-wizard-template.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    OsButtonComponent,
    OsCardComponent,
    OsProgressBarComponent,
    OsPageHeaderComponent,
    OsIconComponent,
    OsBadgeComponent,
  ],
})
export class OsWizardTemplateComponent {
  config = input.required<WizardTemplateConfig>();
  currentStep = input.required<string>();
  size = input<'small' | 'medium' | 'large'>('medium');
  variant = input<'default' | 'compact' | 'detailed'>('default');
  theme = input<'light' | 'dark'>('light');
  disabled = input(false);
  loading = input(false);
  showHeader = input(true);
  showProgress = input(true);
  showStepNavigation = input(true);
  showActions = input(true);
  showStepNumbers = input(true);
  showStepIcons = input(true);
  allowSkipSteps = input(false);
  showStepValidation = input(true);

  next = output<void>();
  previous = output<void>();
  finishWizard = output<void>();
  skip = output<void>();
  stepClick = output<{ step: WizardStep; index: number }>();

  protected templateClass = computed(() => {
    return [
      'os-wizard-template',
      `os-wizard-template--${this.variant()}`,
      `os-wizard-template--${this.size()}`,
      `os-wizard-template--${this.theme()}`,
      this.disabled() ? 'os-wizard-template--disabled' : '',
      this.loading() ? 'os-wizard-template--loading' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  protected cardClass = computed(() => {
    return ['os-wizard-template__card', `os-wizard-template__card--${this.variant()}`]
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

  protected currentStepIndex = computed(() => {
    const currentStep = this.currentStep();
    return this.config().steps.findIndex((step) => step.id === currentStep);
  });

  protected totalSteps = computed(() => {
    return this.config().steps.length;
  });

  protected progressValue = computed(() => {
    const currentIndex = this.currentStepIndex();
    const total = this.totalSteps();
    return total > 0 ? Math.round((currentIndex / total) * 100) : 0;
  });

  protected showPreviousButton = computed(() => {
    return this.config().showPreviousButton !== false;
  });

  protected showNextButton = computed(() => {
    return this.config().showNextButton !== false;
  });

  protected showFinishButton = computed(() => {
    return this.config().showFinishButton !== false;
  });

  protected isLastStep = computed(() => {
    return this.currentStepIndex() === this.totalSteps() - 1;
  });

  protected isCurrentStepValid = computed(() => {
    if (!this.showStepValidation()) return true;

    const currentStep = this.config().steps[this.currentStepIndex()];
    return currentStep ? !currentStep.disabled : true;
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

  protected stepClass = (step: WizardStep, index: number) => {
    const currentIndex = this.currentStepIndex();
    return [
      'os-wizard-template__step',
      `os-wizard-template__step--${this.size()}`,
      index === currentIndex ? 'os-wizard-template__step--current' : '',
      step.completed ? 'os-wizard-template__step--completed' : '',
      step.disabled ? 'os-wizard-template__step--disabled' : '',
      step.optional ? 'os-wizard-template__step--optional' : '',
    ]
      .filter(Boolean)
      .join(' ');
  };

  protected iconSize = computed(() => {
    const size = this.size();
    return size === 'small' ? 'sm' : size === 'medium' ? 'md' : 'lg';
  });

  protected badgeSize = computed(() => {
    const size = this.size();
    return size === 'small' ? 'sm' : size === 'medium' ? 'md' : 'lg';
  });

  protected onStepClick(step: WizardStep, index: number): void {
    if (step.disabled) return;

    this.stepClick.emit({ step, index });
  }
}
