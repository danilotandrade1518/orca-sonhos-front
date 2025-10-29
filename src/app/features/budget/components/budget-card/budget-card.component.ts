import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetDto } from '../../../../../dtos/budget';
import { OsCardComponent } from '@shared/ui-components/molecules/os-card/os-card.component';
import { OsButtonComponent } from '@shared/ui-components/atoms/os-button/os-button.component';

@Component({
  selector: 'os-budget-card',
  standalone: true,
  imports: [CommonModule, OsCardComponent, OsButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <os-card
      [clickable]="true"
      [selected]="selected()"
      [disabled]="disabled()"
      [loading]="loading()"
      [ariaLabel]="ariaLabel()"
      [variant]="variant()"
      [size]="size()"
      [actions]="showActions()"
      (cardClick)="onCardClick()"
    >
      <div class="budget-card__header">
        <h3 class="budget-card__name">{{ budget().name }}</h3>
        <span
          class="budget-card__type"
          [class.budget-card__type--personal]="budget().type === 'PERSONAL'"
          [class.budget-card__type--shared]="budget().type === 'SHARED'"
        >
          {{ budget().type === 'PERSONAL' ? 'Pessoal' : 'Compartilhado' }}
        </span>
      </div>

      <div class="budget-card__info">
        <p class="budget-card__participants">
          {{ budget().participantsCount }}
          {{ budget().participantsCount === 1 ? 'participante' : 'participantes' }}
        </p>
      </div>

      @if (showActions()) {
      <div slot="actions" class="budget-card__actions">
        <os-button
          variant="secondary"
          size="small"
          [ariaLabel]="'Editar orçamento ' + budget().name"
          (clicked)="onEditClick()"
        >
          Editar
        </os-button>
        <os-button
          variant="danger"
          size="small"
          [ariaLabel]="'Excluir orçamento ' + budget().name"
          (clicked)="onDeleteClick()"
        >
          Excluir
        </os-button>
      </div>
      }
    </os-card>
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

  onCardClick(): void {
    if (!this.disabled() && !this.loading()) {
      this.cardClick.emit();
    }
  }

  onEditClick(): void {
    this.editClick.emit(this.budget().id);
  }

  onDeleteClick(): void {
    this.deleteClick.emit(this.budget().id);
  }
}
