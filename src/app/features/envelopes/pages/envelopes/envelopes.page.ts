import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
  ChangeDetectionStrategy,
  untracked,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { EnvelopeState } from '@core/services/envelope/envelope-state/envelope.state';
import { BudgetSelectionService } from '@core/services/budget-selection/budget-selection.service';
import { EnvelopeCardComponent } from '@shared/ui-components/molecules/envelope-card';
import { EnvelopeFormComponent } from '../../components/envelope-form/envelope-form.component';
import { ConfirmDeleteEnvelopeModalComponent } from '../../components/confirm-delete-modal/confirm-delete-modal.component';
import { OsPageComponent } from '@shared/ui-components/organisms/os-page/os-page.component';
import {
  OsPageHeaderComponent,
  PageHeaderAction,
} from '@shared/ui-components/organisms/os-page-header/os-page-header.component';
import { OsButtonComponent } from '@shared/ui-components/atoms/os-button/os-button.component';
import { OsEntityListComponent } from '@shared/ui-components/organisms/os-entity-list/os-entity-list.component';
import { OsAlertComponent } from '@shared/ui-components/molecules/os-alert/os-alert.component';
import type { EnvelopeDto } from '../../../../../dtos/envelope';

@Component({
  selector: 'os-envelopes-page',
  standalone: true,
  imports: [
    CommonModule,
    EnvelopeCardComponent,
    EnvelopeFormComponent,
    ConfirmDeleteEnvelopeModalComponent,
    OsPageComponent,
    OsPageHeaderComponent,
    OsButtonComponent,
    OsEntityListComponent,
    OsAlertComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <os-page variant="default" size="medium" ariaLabel="Página de envelopes">
      <os-page-header
        title="Envelopes"
        subtitle="Gerencie seus limites de gastos por categoria"
        [actions]="pageHeaderActions()"
        (actionClick)="onPageHeaderActionClick($event)"
      />

      @if (currentState() === 'error') {
      <os-alert
        type="error"
        [title]="'Erro ao carregar envelopes'"
        [role]="'alert'"
        [ariaLive]="'assertive'"
        [showIcon]="true"
        [dismissible]="false"
      >
        {{ errorMessage() }}
        <div class="envelopes-page__error-action">
          <os-button
            variant="primary"
            size="medium"
            icon="refresh"
            (buttonClick)="retry()"
            [attr.aria-label]="'Tentar carregar envelopes novamente'"
          >
            Tentar Novamente
          </os-button>
        </div>
      </os-alert>
      }

      <os-entity-list
        layout="grid"
        size="medium"
        [isLoading]="currentState() === 'loading'"
        [isEmpty]="currentState() === 'empty'"
        loadingText="Carregando envelopes..."
        emptyTitle="Nenhum envelope cadastrado"
        emptyText="Crie seu primeiro envelope para controlar seus gastos por categoria"
        emptyIcon="wallet"
        [emptyAction]="!!selectedBudgetId()"
        emptyActionLabel="Criar primeiro envelope"
        emptyActionIcon="plus"
        ariaLabel="Lista de envelopes"
        (emptyActionClick)="openCreateModal()"
      >
        @for (envelope of envelopes(); track envelope.id) {
        <os-envelope-card
          [envelope]="envelope"
          (edit)="onEditEnvelope($event)"
          (delete)="onDeleteEnvelope($event)"
        />
        }
      </os-entity-list>

      @if (showCreateModal()) {
      <os-envelope-form [mode]="'create'" (saved)="onFormSaved()" (cancelled)="onFormCancelled()" />
      } @if (showEditModal() && editingEnvelope()) {
      <os-envelope-form
        [mode]="'edit'"
        [envelope]="editingEnvelope()!"
        (saved)="onFormSaved()"
        (cancelled)="onFormCancelled()"
      />
      } @if (showDeleteModal() && deletingEnvelope()) {
      <os-confirm-delete-envelope-modal
        [envelope]="deletingEnvelope()!"
        (closed)="closeDeleteModal()"
      />
      }
    </os-page>
  `,
  styleUrl: './envelopes.page.scss',
})
export class EnvelopesPage implements OnInit {
  readonly state = inject(EnvelopeState);
  private readonly budgetSelection = inject(BudgetSelectionService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private _lastBudgetId: string | null = null;

  readonly selectedBudgetId = this.budgetSelection.selectedBudgetId;
  readonly envelopes = computed(() => this.state.envelopesByBudgetId());
  readonly hasEnvelopes = computed(() => this.envelopes().length > 0);

  readonly deletingEnvelope = signal<EnvelopeDto | null>(null);
  readonly editingEnvelope = signal<EnvelopeDto | null>(null);

  readonly showCreateModal = computed(() => {
    return this.route.snapshot.data['modalMode'] === 'create';
  });

  readonly showEditModal = signal(false);
  readonly showDeleteModal = signal(false);

  readonly currentState = computed(() => {
    if (this.state.loading()) return 'loading';
    if (this.state.error()) return 'error';
    if (!this.selectedBudgetId()) return 'empty';
    if (this.envelopes().length === 0) return 'empty';
    return 'success';
  });

  readonly errorMessage = computed(() => this.state.error() || 'Erro ao carregar envelopes');

  readonly pageHeaderActions = computed<PageHeaderAction[]>(() => {
    return [
      {
        label: 'Novo Envelope',
        icon: 'plus',
        variant: 'primary',
        size: 'medium',
        disabled: !this.selectedBudgetId(),
      },
    ];
  });

  onPageHeaderActionClick(action: PageHeaderAction): void {
    if (action.label === 'Novo Envelope') {
      this.openCreateModal();
    }
  }

  constructor() {
    effect(() => {
      const budgetId = this.selectedBudgetId();

      if (budgetId === this._lastBudgetId || this.state.loading()) {
        return;
      }

      untracked(() => {
        if (budgetId) {
          this._lastBudgetId = budgetId;
          this.state.loadEnvelopes();
        } else {
          this._lastBudgetId = null;
        }
      });
    });
  }

  ngOnInit(): void {
    const budgetId = this.selectedBudgetId();
    if (budgetId) {
      this.state.loadEnvelopes();
    }
  }

  retry(): void {
    this.state.clearError();
    this.state.loadEnvelopes();
  }

  openCreateModal(): void {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  onEditEnvelope(envelope: EnvelopeDto): void {
    this.editingEnvelope.set(envelope);
    this.showEditModal.set(true);
  }

  onDeleteEnvelope(envelope: EnvelopeDto): void {
    this.deletingEnvelope.set(envelope);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
    this.deletingEnvelope.set(null);
  }

  onFormSaved(): void {
    this.showEditModal.set(false);
    this.editingEnvelope.set(null);
    this.router.navigate(['/envelopes'], { replaceUrl: true });
  }

  onFormCancelled(): void {
    this.showEditModal.set(false);
    this.editingEnvelope.set(null);
    this.router.navigate(['/envelopes'], { replaceUrl: true });
  }
}

