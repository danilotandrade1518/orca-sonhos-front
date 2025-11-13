import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetDto } from '../../../../../dtos/budget';
import { OsEntityCardComponent } from '@shared/ui-components/organisms/os-entity-card/os-entity-card.component';
import { OsDeleteButtonComponent } from '@shared/ui-components/atoms/os-delete-button';
import { OsEditButtonComponent } from '@shared/ui-components/atoms/os-edit-button';

@Component({
  selector: 'os-budget-card',
  standalone: true,
  imports: [CommonModule, OsEntityCardComponent, OsDeleteButtonComponent, OsEditButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <os-entity-card
      [clickable]="false"
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
        <os-edit-button
          [ariaLabel]="'Editar orçamento ' + budget().name"
          (editClick)="onEdit($event)"
        />
        <os-delete-button
          [ariaLabel]="'Excluir orçamento ' + budget().name"
          (deleteClick)="onDelete()"
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

  onEdit(event?: MouseEvent): void {
    event?.stopPropagation();
    this.editClick.emit(this.budget().id);
  }

  onDelete(): void {
    this.deleteClick.emit(this.budget().id);
  }
}
