import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';

import { OsIconComponent } from '../../atoms/os-icon/os-icon.component';
import { OsSpinnerComponent } from '../../atoms/os-spinner/os-spinner.component';
import { OsButtonComponent } from '../../atoms/os-button/os-button.component';

export type ChartContainerVariant = 'default' | 'compact';

@Component({
  selector: 'os-chart-container',
  standalone: true,
  imports: [OsIconComponent, OsSpinnerComponent, OsButtonComponent],
  template: `
    <div
      [class]="containerClasses()"
      [attr.role]="'region'"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-describedby]="titleId()"
      [attr.aria-live]="ariaLive()"
    >
      @if (title() || subtitle()) {
      <div class="os-chart-container__header">
        @if (title()) {
        <h2 [id]="titleId()" class="os-chart-container__title">{{ title() }}</h2>
        }
        @if (subtitle()) {
        <p class="os-chart-container__subtitle">{{ subtitle() }}</p>
        }
      </div>
      }

      <div class="os-chart-container__content">
        @if (loading()) {
        <div class="os-chart-container__loading">
          <os-spinner size="lg" variant="primary" [ariaLabel]="loadingText()" />
          @if (loadingText()) {
          <p class="os-chart-container__loading-text">{{ loadingText() }}</p>
          }
        </div>
        } @else if (error()) {
        <div class="os-chart-container__error">
          <os-icon name="error" size="xl" variant="error" [ariaHidden]="true" />
          <p class="os-chart-container__error-message">{{ error() }}</p>
          @if (retryable()) {
          <os-button variant="secondary" size="small" (buttonClick)="onRetry()">
            Tentar Novamente
          </os-button>
          }
        </div>
        } @else if (empty()) {
        <div class="os-chart-container__empty">
          <os-icon name="chart" size="xl" variant="default" [ariaHidden]="true" />
          <p class="os-chart-container__empty-message">{{ emptyText() }}</p>
          @if (emptyActionText()) {
          <os-button variant="secondary" size="small" (buttonClick)="onEmptyAction()">
            {{ emptyActionText() }}
          </os-button>
          }
        </div>
        } @else {
        <div class="os-chart-container__chart">
          <ng-content />
        </div>
        }
      </div>
    </div>
  `,
  styleUrl: './chart-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'os-chart-container-host',
  },
})
export class ChartContainerComponent {
  title = input<string>('');
  subtitle = input<string>('');
  loading = input(false);
  error = input<string | null>(null);
  empty = input(false);
  emptyText = input<string>('Nenhum dado disponível para o período selecionado');
  loadingText = input<string>('Carregando gráfico...');
  retryable = input(false);
  emptyActionText = input<string>('');
  variant = input<ChartContainerVariant>('default');
  ariaLabel = input<string | null>(null);
  ariaDescribedBy = input<string | null>(null);

  retry = output<void>();
  emptyAction = output<void>();

  private readonly uniqueId = `chart-container-${Math.random().toString(36).substr(2, 9)}`;

  titleId = computed(() => {
    return this.title() ? `${this.uniqueId}-title` : null;
  });

  ariaLive = computed(() => {
    if (this.loading()) {
      return 'polite';
    }
    if (this.error()) {
      return 'assertive';
    }
    return null;
  });

  containerClasses = computed(() => {
    const classes = ['os-chart-container'];

    if (this.variant() !== 'default') {
      classes.push(`os-chart-container--${this.variant()}`);
    }

    if (this.loading()) {
      classes.push('os-chart-container--loading');
    }

    if (this.error()) {
      classes.push('os-chart-container--error');
    }

    if (this.empty()) {
      classes.push('os-chart-container--empty');
    }

    return classes.join(' ');
  });

  onRetry(): void {
    this.retry.emit();
  }

  onEmptyAction(): void {
    this.emptyAction.emit();
  }
}
