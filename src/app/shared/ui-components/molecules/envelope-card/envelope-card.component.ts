import { Component, input, output, computed, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OsCardComponent } from '../os-card/os-card.component';
import { OsProgressBarComponent } from '../../atoms/os-progress-bar/os-progress-bar.component';
import { OsMoneyDisplayComponent } from '../os-money-display/os-money-display.component';
import { OsDeleteButtonComponent } from '../../atoms/os-delete-button';
import { OsEditButtonComponent } from '../../atoms/os-edit-button';
import { LocaleService } from '@shared/formatting';
import { EnvelopeDto } from '../../../../../dtos/envelope';

@Component({
  selector: 'os-envelope-card',
  standalone: true,
  imports: [
    CommonModule,
    OsCardComponent,
    OsProgressBarComponent,
    OsMoneyDisplayComponent,
    OsDeleteButtonComponent,
    OsEditButtonComponent,
  ],
  template: `
    <div [class]="cardWrapperClass()">
      <os-card
        [variant]="'default'"
        [size]="'medium'"
        [clickable]="false"
        [actions]="true"
        [ariaLabel]="ariaLabelText()"
      >
      <div class="os-envelope-card__content">
        <div class="os-envelope-card__header">
          <div class="os-envelope-card__title-section">
            <h3 class="os-envelope-card__name">{{ envelope().name }}</h3>
            <span class="os-envelope-card__category">{{ envelope().categoryName }}</span>
          </div>
        </div>

        <div class="os-envelope-card__progress">
          <os-progress-bar
            [value]="envelope().usagePercentage"
            [max]="100"
            [variant]="progressVariant()"
            [ariaLabel]="progressAriaLabel()"
            [showPercentage]="false"
          />
          <span class="os-envelope-card__percentage">{{ formatPercentage() }}</span>
        </div>

        <div class="os-envelope-card__values">
          <div class="os-envelope-card__spent">
            <span class="os-envelope-card__value-label">Gasto</span>
            <os-money-display
              [value]="envelope().currentUsage"
              [currency]="'BRL'"
              [size]="'sm'"
              [ariaLabel]="getSpentAriaLabel()"
            />
          </div>
          <div class="os-envelope-card__limit">
            <span class="os-envelope-card__value-label">Limite</span>
            <os-money-display
              [value]="envelope().limit"
              [currency]="'BRL'"
              [size]="'sm'"
              [ariaLabel]="getLimitAriaLabel()"
            />
          </div>
        </div>
      </div>

      <div class="os-envelope-card__actions" slot="actions">
        <os-edit-button
          [ariaLabel]="'Editar envelope ' + envelope().name"
          (editClick)="onEdit($event)"
        />
        <os-delete-button
          [ariaLabel]="'Excluir envelope ' + envelope().name"
          (deleteClick)="onDelete()"
        />
      </div>
      </os-card>
    </div>
  `,
  styleUrls: ['./envelope-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnvelopeCardComponent {
  private readonly localeService = inject(LocaleService);

  readonly envelope = input.required<EnvelopeDto>();

  readonly edit = output<EnvelopeDto>();
  readonly delete = output<EnvelopeDto>();

  readonly isOverBudget = computed(() => this.envelope().usagePercentage > 100);

  readonly isNearLimit = computed(() => {
    const pct = this.envelope().usagePercentage;
    return pct >= 80 && pct <= 100;
  });

  readonly progressVariant = computed(() => {
    const pct = this.envelope().usagePercentage;
    if (pct > 100) return 'danger';
    if (pct >= 80) return 'warning';
    return 'success';
  });

  readonly statusLabel = computed(() => {
    if (this.isOverBudget()) return 'Limite excedido';
    if (this.isNearLimit()) return 'Próximo do limite';
    return 'Dentro do limite';
  });

  readonly cardWrapperClass = computed(() => {
    const classes = ['os-envelope-card-wrapper'];
    if (this.isOverBudget()) {
      classes.push('os-envelope-card-wrapper--over-budget');
    } else if (this.isNearLimit()) {
      classes.push('os-envelope-card-wrapper--near-limit');
    } else {
      classes.push('os-envelope-card-wrapper--normal');
    }
    return classes.join(' ');
  });

  readonly ariaLabelText = computed(() => {
    const env = this.envelope();
    if (!env) return 'Card de envelope';
    return `Envelope ${env.name}, categoria ${env.categoryName}, ${this.statusLabel()}, ${this.formatPercentage()} usado`;
  });

  readonly progressAriaLabel = computed(() => {
    const env = this.envelope();
    const pct = this.formatPercentage();
    return `Uso do envelope ${env.name}: ${pct} do limite`;
  });

  readonly getSpentAriaLabel = computed(() => {
    const env = this.envelope();
    return `Gasto do envelope ${env.name}: ${this.formatCurrency(env.currentUsage)}`;
  });

  readonly getLimitAriaLabel = computed(() => {
    const env = this.envelope();
    return `Limite do envelope ${env.name}: ${this.formatCurrency(env.limit)}`;
  });

  formatPercentage(): string {
    const pct = this.envelope().usagePercentage;
    return `${pct.toFixed(1)}%`;
  }

  onEdit(event?: MouseEvent): void {
    event?.stopPropagation();
    const env = this.envelope();
    if (env) {
      this.edit.emit(env);
    }
  }

  onDelete(): void {
    const env = this.envelope();
    if (env) {
      this.delete.emit(env);
    }
  }

  private formatCurrency(value: number): string {
    return this.localeService.formatCurrency(value, 'BRL');
  }
}
