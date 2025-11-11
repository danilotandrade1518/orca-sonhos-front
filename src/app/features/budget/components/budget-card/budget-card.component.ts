import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetDto } from '../../../../../dtos/budget';
import {
  OsEntityCardComponent,
  type OsEntityCardAction,
} from '@shared/ui-components/organisms/os-entity-card/os-entity-card.component';
import { OsButtonComponent } from '@shared/ui-components/atoms/os-button/os-button.component';

@Component({
  selector: 'os-budget-card',
  standalone: true,
  imports: [CommonModule, OsEntityCardComponent, OsButtonComponent],
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
      [customActions]="showActions()"
      [showActionsMenu]="false"
      (cardClick)="onCardClick()"
    >
      <span
        slot="title"
        class="budget-card__type"
        [class.budget-card__type--personal]="budget().type === 'PERSONAL'"
        [class.budget-card__type--shared]="budget().type === 'SHARED'"
      >
        {{ budget().type === 'PERSONAL' ? 'Pessoal' : 'Compartilhado' }}
      </span>

      @if (showActions()) {
      <div slot="actions" class="budget-card__actions">
        <os-button
          variant="tertiary"
          size="small"
          [icon]="'edit'"
          [ariaLabel]="'Editar orçamento ' + budget().name"
          (buttonClick)="onEdit()"
        />
        <os-button
          variant="danger"
          size="small"
          [icon]="'delete'"
          [ariaLabel]="'Excluir orçamento ' + budget().name"
          (buttonClick)="onDelete()"
        />
      </div>
      }
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

  onEdit(): void {
    this.editClick.emit(this.budget().id);
  }

  onDelete(): void {
    this.deleteClick.emit(this.budget().id);
  }
}
