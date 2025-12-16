import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';

import { OsCardComponent } from '../../molecules/os-card/os-card.component';
import { OsButtonComponent, OsButtonVariant } from '../../atoms/os-button/os-button.component';
import { OsEntityActionsComponent } from '../os-entity-actions/os-entity-actions.component';

export type OsEntityCardVariant = 'default' | 'outlined' | 'elevated' | 'flat';
export type OsEntityCardSize = 'small' | 'medium' | 'large';

export interface OsEntityCardAction {
  id: string;
  label: string;
  icon?: string;
  variant?: OsButtonVariant;
  disabled?: boolean;
}

@Component({
  selector: 'os-entity-card',
  standalone: true,
  imports: [OsCardComponent, OsButtonComponent, OsEntityActionsComponent],
  template: `
    <os-card
      [variant]="variant()"
      [size]="size()"
      [clickable]="clickable()"
      [disabled]="disabled()"
      [loading]="loading()"
      [selected]="selected()"
      [ariaLabel]="ariaLabel()"
      [ariaDescribedBy]="ariaDescribedBy()"
      [header]="hasHeader()"
      [actions]="hasActions() || customActions()"
      (cardClick)="onCardClick()"
    >
      @if (hasHeader()) {
      <div slot="header" class="os-entity-card__header">
        <div class="os-entity-card__title-section">
          @if (title()) {
          <h3 class="os-entity-card__title">{{ title() }}</h3>
          }
          <ng-content select="[slot=title]" />
        </div>
        @if (hasActions() && showActionsMenu()) {
        <os-entity-actions
          [actions]="actions()"
          [size]="size()"
          (actionClick)="onActionClick($event)"
        />
        }
      </div>
      }

      <div class="os-entity-card__content">
        @if (meta()) {
        <div class="os-entity-card__meta">
          <ng-content select="[slot=meta]" />
          <span class="os-entity-card__meta-text">{{ meta() }}</span>
        </div>
        } @if (hasMetrics()) {
        <div class="os-entity-card__metrics">
          <ng-content select="[slot=metrics]" />
        </div>
        }

        <ng-content />
      </div>

      @if ((customActions() || hasActions()) && !showActionsMenu()) {
      <div slot="actions" class="os-entity-card__actions">
        <ng-content select="[slot=actions]" />
        @if (hasActions()) {
          @for (action of actions(); track action.id) {
          <os-button
            [variant]="action.variant || 'primary'"
            [size]="getActionSize()"
            [icon]="action.icon || 'plus'"
            [disabled]="action.disabled || disabled()"
            [ariaLabel]="action.label"
            (buttonClick)="onActionClick(action)"
          >
            @if (!actionsIconOnly()) { {{ action.label }} }
          </os-button>
          }
        }
      </div>
      }
    </os-card>
  `,
  styleUrl: './os-entity-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'os-entity-card-host',
  },
})
export class OsEntityCardComponent {
  variant = input<OsEntityCardVariant>('default');
  size = input<OsEntityCardSize>('medium');
  title = input<string | null>(null);
  meta = input<string | null>(null);
  clickable = input<boolean>(false);
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  selected = input<boolean>(false);
  actions = input<OsEntityCardAction[]>([]);
  showActionsMenu = input<boolean>(false);
  customActions = input<boolean>(false);
  actionsIconOnly = input<boolean>(true);
  ariaLabel = input<string | null>(null);
  ariaDescribedBy = input<string | null>(null);

  cardClick = output<void>();
  actionClick = output<OsEntityCardAction>();

  hasHeader = computed(() => {
    return this.title() !== null || this.actions().length > 0;
  });

  hasActions = computed(() => {
    return this.actions().length > 0;
  });

  hasMetrics = computed(() => {
    return false;
  });

  getActionSize = computed(() => {
    const sizeMap: Record<OsEntityCardSize, 'small' | 'medium'> = {
      small: 'small',
      medium: 'small',
      large: 'medium',
    };
    return sizeMap[this.size()];
  });

  onCardClick(): void {
    if (!this.disabled() && !this.loading()) {
      this.cardClick.emit();
    }
  }

  onActionClick(action: OsEntityCardAction): void {
    if (!action.disabled && !this.disabled()) {
      this.actionClick.emit(action);
    }
  }
}
