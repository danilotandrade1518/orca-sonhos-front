import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { CategorySpendingDto } from '../../../../../dtos/report/category-spending.dto';
import { OsProgressBarComponent } from '@shared/ui-components/atoms/os-progress-bar/os-progress-bar.component';
import { OsMoneyDisplayComponent } from '@shared/ui-components/molecules/os-money-display/os-money-display.component';
import { OsIconComponent } from '@shared/ui-components/atoms/os-icon/os-icon.component';
import { LocaleService } from '@shared/formatting';

@Component({
  selector: 'os-category-spending-widget',
  standalone: true,
  imports: [CommonModule, OsProgressBarComponent, OsMoneyDisplayComponent, OsIconComponent],
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
          <li class="category-spending-widget__item" role="listitem">
            <div class="category-spending-widget__item-header">
              <h3 class="category-spending-widget__item-name">{{ category.categoryName }}</h3>
              <span class="category-spending-widget__item-percentage">
                {{ formatPercentage(category.percentage) }}
              </span>
            </div>
            <div class="category-spending-widget__item-progress">
              <os-progress-bar
                [value]="category.percentage"
                [variant]="getProgressVariant(category.percentage)"
                [ariaLabel]="category.categoryName + ': ' + formatPercentage(category.percentage) + ' do total'"
              />
            </div>
            <div class="category-spending-widget__item-footer">
              <os-money-display
                [value]="category.totalAmount"
                [currency]="'BRL'"
                [size]="'sm'"
                [ariaLabel]="'Valor gasto: ' + formatCurrency(category.totalAmount)"
              />
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

        <div class="category-spending-widget__info" role="note" aria-label="Informação sobre visão completa">
          <os-icon name="info" size="sm" variant="info" aria-hidden="true" />
          <p class="category-spending-widget__info-text">
            A visão completa de <strong>% do planejado</strong> estará disponível quando o sistema de envelopes for implementado.
          </p>
        </div>
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
  readonly isLoading = input<boolean>(false);
  readonly subtitle = input<string | undefined>(undefined);
  readonly maxDisplayed = input<number>(5);

  readonly isEmpty = computed(() => !this.isLoading() && this.categories().length === 0);
  readonly displayedCategories = computed(() => {
    const categories = this.categories();
    return categories.slice(0, this.maxDisplayed());
  });
  readonly hasMoreCategories = computed(() => this.categories().length > this.maxDisplayed());

  formatCurrency(value: number): string {
    return this.localeService.formatCurrency(value, 'BRL');
  }

  formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`;
  }

  getProgressVariant(percentage: number): 'default' | 'success' | 'warning' | 'error' {
    if (percentage >= 30) {
      return 'error';
    } else if (percentage >= 20) {
      return 'warning';
    } else if (percentage >= 10) {
      return 'default';
    }
    return 'success';
  }
}

