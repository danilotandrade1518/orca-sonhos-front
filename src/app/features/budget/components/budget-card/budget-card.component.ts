import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetDto } from '../../../../../dtos/budget';
import {
  OsEntityCardComponent,
  type OsEntityCardAction,
} from '@shared/ui-components/organisms/os-entity-card/os-entity-card.component';

@Component({
  selector: 'os-budget-card',
  standalone: true,
  imports: [CommonModule, OsEntityCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <os-entity-card
      [clickable]="true"
      [selected]="selected()"
      [disabled]="disabled()"
      [loading]="loading()"
      [ariaLabel]="ariaLabel()"
      [variant]="variant()"
      [size]="size()"
      [title]="titleText()"
      [meta]="metaText()"
      [actions]="cardActions()"
      [showActionsMenu]="false"
      (cardClick)="onCardClick()"
      (actionClick)="onActionClick($event)"
    >
      <span
        slot="title"
        class="budget-card__type"
        [class.budget-card__type--personal]="budget().type === 'PERSONAL'"
        [class.budget-card__type--shared]="budget().type === 'SHARED'"
      >
        {{ budget().type === 'PERSONAL' ? 'Pessoal' : 'Compartilhado' }}
      </span>
    </os-entity-card>
  `,
  styleUrl: './budget-card.component.scss',
  host: {
    class: 'budget-card-host',
  },
})
export class BudgetCardComponent {
  readonly budget = input.required<BudgetDto>();
  readonly selected = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly loading = input<boolean>(false);
  readonly showActions = input<boolean>(true);
  readonly variant = input<'default' | 'outlined' | 'elevated' | 'flat'>('default');
  readonly size = input<'small' | 'medium' | 'large'>('medium');

  readonly cardClick = output<void>();
  readonly editClick = output<string>();
  readonly deleteClick = output<string>();

  readonly ariaLabel = computed(() => `Orçamento ${this.budget().name}`);

  readonly titleText = computed(() => {
    return this.budget().name;
  });

  readonly metaText = computed(() => {
    const count = this.budget().participantsCount;
    return `${count} ${count === 1 ? 'participante' : 'participantes'}`;
  });

  readonly cardActions = computed<OsEntityCardAction[]>(() => {
    if (!this.showActions()) {
      return [];
    }
    return [
      {
        id: 'edit',
        label: 'Editar',
        icon: 'edit',
        variant: 'primary',
      },
      {
        id: 'delete',
        label: 'Excluir',
        icon: 'trash',
        variant: 'danger',
      },
    ];
  });

  onCardClick(): void {
    if (!this.disabled() && !this.loading()) {
      this.cardClick.emit();
    }
  }

  onActionClick(action: OsEntityCardAction): void {
    if (action.id === 'edit') {
      this.editClick.emit(this.budget().id);
    } else if (action.id === 'delete') {
      this.deleteClick.emit(this.budget().id);
    }
  }
}
