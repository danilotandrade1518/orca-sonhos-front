import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output, inject } from '@angular/core';
import { Router } from '@angular/router';

import { SuggestedAction } from '../../types/dashboard.types';
import { OsCardComponent } from '@shared/ui-components/molecules/os-card/os-card.component';
import { OsIconComponent } from '@shared/ui-components/atoms/os-icon/os-icon.component';

@Component({
  selector: 'os-suggested-actions-widget',
  standalone: true,
  imports: [CommonModule, OsCardComponent, OsIconComponent],
  template: `
    <div class="suggested-actions-widget" role="region" [attr.aria-labelledby]="'suggested-actions-title'">
      <header class="suggested-actions-widget__header">
        <h2 id="suggested-actions-title" class="suggested-actions-widget__title">Próximas Ações</h2>
      </header>

      @if (isLoading()) {
      <div class="suggested-actions-widget__loading" role="status" aria-live="polite">
        <div class="suggested-actions-widget__skeleton" aria-hidden="true">
          @for (item of [1, 2, 3]; track item) {
          <div class="suggested-actions-widget__skeleton-item">
            <div class="suggested-actions-widget__skeleton-icon"></div>
            <div class="suggested-actions-widget__skeleton-content">
              <div class="suggested-actions-widget__skeleton-title"></div>
              <div class="suggested-actions-widget__skeleton-description"></div>
            </div>
          </div>
          }
        </div>
      </div>
      } @else if (isEmpty()) {
      <div class="suggested-actions-widget__empty" role="status">
        <os-icon name="check_circle" size="lg" variant="default" aria-hidden="true" />
        <p class="suggested-actions-widget__empty-text">
          Nenhuma ação sugerida no momento. Continue acompanhando suas metas.
        </p>
      </div>
      } @else {
      <div class="suggested-actions-widget__list" role="list">
        @for (action of displayedActions(); track action.id) {
        <os-card
          [variant]="'outlined'"
          [size]="'medium'"
          [clickable]="true"
          [class]="'suggested-actions-widget__card suggested-actions-widget__card--' + action.priority"
          [ariaLabel]="action.title + '. ' + action.description"
          (cardClick)="onActionClick(action)"
        >
          <div class="suggested-actions-widget__card-content">
            <div class="suggested-actions-widget__card-header">
              <os-icon
                [name]="action.icon"
                [size]="'md'"
                [variant]="getIconVariant(action.priority)"
                [ariaHidden]="true"
              />
              <h3 class="suggested-actions-widget__card-title">{{ action.title }}</h3>
            </div>
            <p class="suggested-actions-widget__card-description">{{ action.description }}</p>
          </div>
        </os-card>
        }
      </div>
      }
    </div>
  `,
  styleUrls: ['./suggested-actions-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuggestedActionsWidgetComponent {
  private readonly router = inject(Router);

  readonly actions = input<SuggestedAction[]>([]);
  readonly isLoading = input<boolean>(false);
  readonly maxDisplayed = input<number>(5);

  readonly actionClick = output<SuggestedAction>();

  readonly isEmpty = computed(() => !this.isLoading() && this.actions().length === 0);
  readonly displayedActions = computed(() => {
    const actions = this.actions();
    return actions.slice(0, this.maxDisplayed());
  });

  getIconVariant(priority: 'high' | 'medium' | 'low'): 'default' | 'error' | 'warning' | 'info' {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  }

  onActionClick(action: SuggestedAction): void {
    this.actionClick.emit(action);
    if (action.route) {
      this.router.navigate([action.route]);
    }
  }
}
