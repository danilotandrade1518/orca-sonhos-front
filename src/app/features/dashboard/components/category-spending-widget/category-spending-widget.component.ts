import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CategorySpendingDto } from '../../../../../dtos/report/category-spending.dto';
import { EnvelopeDto } from '../../../../../dtos/envelope';
import { OsProgressBarComponent } from '@shared/ui-components/atoms/os-progress-bar/os-progress-bar.component';
import { OsMoneyDisplayComponent } from '@shared/ui-components/molecules/os-money-display/os-money-display.component';
import { OsIconComponent } from '@shared/ui-components/atoms/os-icon/os-icon.component';
import { LocaleService } from '@shared/formatting';

interface CategoryWithEnvelope extends CategorySpendingDto {
  envelope?: EnvelopeDto;
  envelopeUsagePercentage?: number;
  hasEnvelope: boolean;
  isOverBudget?: boolean;
  isNearLimit?: boolean;
}

@Component({
  selector: 'os-category-spending-widget',
  standalone: true,
  imports: [CommonModule, RouterModule, OsProgressBarComponent, OsMoneyDisplayComponent, OsIconComponent],
  template: `
    <div class="category-spending-widget" role="region" [attr.aria-labelledby]="'category-spending-title'">
      <header class="category-spending-widget__header">
        <h2 id="category-spending-title" class="category-spending-widget__title">Gastos por Categoria</h2>
        @if (subtitle()) {
        <p class="category-spending-widget__subtitle">{{ subtitle() }}</p>
        } @else {
        <p class="category-spending-widget__subtitle">
          Distribuição de gastos no período atual
        </p>
        }
      </header>

      @if (isLoading()) {
      <div class="category-spending-widget__loading" role="status" aria-live="polite">
        <div class="category-spending-widget__skeleton" aria-hidden="true">
          @for (item of [1, 2, 3, 4]; track item) {
          <div class="category-spending-widget__skeleton-item">
            <div class="category-spending-widget__skeleton-name"></div>
            <div class="category-spending-widget__skeleton-bar"></div>
            <div class="category-spending-widget__skeleton-value"></div>
          </div>
          }
        </div>
      </div>
      } @else if (isEmpty()) {
      <div class="category-spending-widget__empty" role="status">
        <os-icon name="category" size="lg" variant="default" aria-hidden="true" />
        <p class="category-spending-widget__empty-text">
          Nenhum gasto por categoria registrado no período atual.
        </p>
      </div>
      } @else {
      <div class="category-spending-widget__content">
        <ul class="category-spending-widget__list" role="list">
          @for (category of displayedCategories(); track category.categoryId) {
          <li class="category-spending-widget__item" role="listitem" [class.category-spending-widget__item--over-budget]="category.isOverBudget" [class.category-spending-widget__item--near-limit]="category.isNearLimit">
            <div class="category-spending-widget__item-header">
              <h3 class="category-spending-widget__item-name">{{ category.categoryName }}</h3>
              <div class="category-spending-widget__item-percentages">
                <span class="category-spending-widget__item-percentage">
                  {{ formatPercentage(category.percentage) }} do total
                </span>
                @if (category.hasEnvelope && category.envelopeUsagePercentage !== undefined) {
                <span class="category-spending-widget__item-envelope-percentage" [class.category-spending-widget__item-envelope-percentage--over]="category.isOverBudget" [class.category-spending-widget__item-envelope-percentage--near]="category.isNearLimit">
                  {{ formatPercentage(category.envelopeUsagePercentage) }} do planejado
                  @if (category.isOverBudget) {
                  <os-icon name="alert" size="xs" variant="danger" aria-label="Limite excedido" />
                  } @else if (category.isNearLimit) {
                  <os-icon name="warning" size="xs" variant="warning" aria-label="Próximo do limite" />
                  }
                </span>
                }
              </div>
            </div>
            <div class="category-spending-widget__item-progress">
              <os-progress-bar
                [value]="category.percentage"
                [variant]="getProgressVariant(category.percentage)"
                [ariaLabel]="category.categoryName + ': ' + formatPercentage(category.percentage) + ' do total'"
              />
              @if (category.hasEnvelope && category.envelopeUsagePercentage !== undefined) {
              <os-progress-bar
                [value]="category.envelopeUsagePercentage"
                [variant]="getEnvelopeProgressVariant(category.envelopeUsagePercentage)"
                [ariaLabel]="category.categoryName + ': ' + formatPercentage(category.envelopeUsagePercentage) + ' do planejado'"
                class="category-spending-widget__item-envelope-progress"
              />
              }
            </div>
            <div class="category-spending-widget__item-footer">
              <os-money-display
                [value]="category.totalAmount"
                [currency]="'BRL'"
                [size]="'sm'"
                [ariaLabel]="'Valor gasto: ' + formatCurrency(category.totalAmount)"
              />
              @if (category.hasEnvelope && category.envelope) {
              <os-money-display
                [value]="category.envelope.limit"
                [currency]="'BRL'"
                [size]="'sm'"
                [ariaLabel]="'Limite planejado: ' + formatCurrency(category.envelope.limit)"
                class="category-spending-widget__item-limit"
              />
              }
              @if (category.transactionCount > 0) {
              <span class="category-spending-widget__item-count">
                {{ category.transactionCount }} {{ category.transactionCount === 1 ? 'transação' : 'transações' }}
              </span>
              }
            </div>
          </li>
          }
        </ul>

        @if (hasMoreCategories()) {
        <footer class="category-spending-widget__footer">
          <p class="category-spending-widget__footer-note">
            Mostrando {{ displayedCategories().length }} de {{ categories().length }} categorias
          </p>
        </footer>
        }

        @if (!hasAnyEnvelope()) {
        <div class="category-spending-widget__info" role="note" aria-label="Informação sobre envelopes">
          <os-icon name="info" size="sm" variant="info" aria-hidden="true" />
          <p class="category-spending-widget__info-text">
            Crie envelopes para ver o <strong>% do planejado</strong> para cada categoria.
            <a routerLink="/envelopes" class="category-spending-widget__info-link">Criar envelopes</a>
          </p>
        </div>
        }
      </div>
      }
    </div>
  `,
  styleUrls: ['./category-spending-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategorySpendingWidgetComponent {
  private readonly localeService = inject(LocaleService);

  readonly categories = input<CategorySpendingDto[]>([]);
  readonly envelopes = input<EnvelopeDto[]>([]);
  readonly isLoading = input<boolean>(false);
  readonly subtitle = input<string | undefined>(undefined);
  readonly maxDisplayed = input<number>(5);

  readonly isEmpty = computed(() => !this.isLoading() && this.categories().length === 0);
  
  readonly categoriesWithEnvelopes = computed(() => {
    const categories = this.categories();
    const envelopes = this.envelopes();
    const envelopeMap = new Map<string, EnvelopeDto>();
    
    envelopes.forEach((envelope) => {
      envelopeMap.set(envelope.categoryId, envelope);
    });

    return categories.map((category): CategoryWithEnvelope => {
      const envelope = envelopeMap.get(category.categoryId);
      const hasEnvelope = !!envelope;
      
      if (!envelope) {
        return {
          ...category,
          hasEnvelope: false,
        };
      }

      const isOverBudget = envelope.usagePercentage > 100;
      const isNearLimit = envelope.usagePercentage >= 80 && envelope.usagePercentage <= 100;

      return {
        ...category,
        envelope,
        envelopeUsagePercentage: envelope.usagePercentage,
        hasEnvelope: true,
        isOverBudget,
        isNearLimit,
      };
    });
  });

  readonly displayedCategories = computed(() => {
    const categories = this.categoriesWithEnvelopes();
    return categories.slice(0, this.maxDisplayed());
  });
  readonly hasMoreCategories = computed(() => this.categories().length > this.maxDisplayed());
  readonly hasAnyEnvelope = computed(() => {
    return this.categoriesWithEnvelopes().some((cat) => cat.hasEnvelope);
  });

  formatCurrency(value: number): string {
    return this.localeService.formatCurrency(value, 'BRL');
  }

  formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`;
  }

  getProgressVariant(percentage: number): 'primary' | 'secondary' | 'success' | 'warning' | 'danger' {
    if (percentage >= 30) {
      return 'danger';
    } else if (percentage >= 20) {
      return 'warning';
    } else if (percentage >= 10) {
      return 'primary';
    }
    return 'success';
  }

  getEnvelopeProgressVariant(percentage: number): 'primary' | 'secondary' | 'success' | 'warning' | 'danger' {
    if (percentage > 100) {
      return 'danger';
    } else if (percentage >= 80) {
      return 'warning';
    }
    return 'success';
  }
}
