import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { CreditCardState } from '@core/services/credit-card/credit-card-state/credit-card.state';
import { OsModalTemplateComponent } from '@shared/ui-components/templates/os-modal-template/os-modal-template.component';
import { OsButtonComponent } from '@shared/ui-components/atoms/os-button/os-button.component';
import { OsPageComponent } from '@shared/ui-components/organisms/os-page/os-page.component';
import {
  OsPageHeaderComponent,
  PageHeaderAction,
  BreadcrumbItem,
} from '@shared/ui-components/organisms/os-page-header/os-page-header.component';
import { OsSkeletonComponent } from '@shared/ui-components/atoms/os-skeleton/os-skeleton.component';
import { OsAlertComponent } from '@shared/ui-components/molecules/os-alert/os-alert.component';
import { LocaleService } from '@shared/formatting';
import type { ModalTemplateConfig } from '@shared/ui-components/templates/os-modal-template/os-modal-template.component';

@Component({
  selector: 'os-credit-card-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    OsModalTemplateComponent,
    OsButtonComponent,
    OsPageComponent,
    OsPageHeaderComponent,
    OsSkeletonComponent,
    OsAlertComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <os-page variant="default" size="medium" ariaLabel="Detalhes do cartão de crédito">
      @switch (currentState()) { @case ('loading') {
      <os-page-header title="Carregando..." [breadcrumbs]="breadcrumbs()" />
      <div
        class="credit-card-detail-page__loading"
        role="status"
        aria-live="polite"
        aria-label="Carregando detalhes do cartão de crédito"
      >
        <os-skeleton variant="card" size="lg" />
        <os-skeleton variant="card" size="lg" />
      </div>
      } @case ('error') {
      <os-page-header title="Erro" [breadcrumbs]="breadcrumbs()" />
      <os-alert
        type="error"
        [title]="'Erro ao carregar cartão de crédito'"
        [role]="'alert'"
        [ariaLive]="'assertive'"
        [showIcon]="true"
        [dismissible]="false"
      >
        {{ errorMessage() }}
        <div class="credit-card-detail-page__error-action">
          <os-button
            variant="primary"
            size="medium"
            icon="arrow-left"
            (buttonClick)="navigateToList()"
            [attr.aria-label]="'Voltar para lista de cartões de crédito'"
          >
            Voltar para Lista
          </os-button>
        </div>
      </os-alert>
      } @default { @if (creditCard(); as creditCard) {
      <os-page-header
        [title]="creditCard.name"
        subtitle="Cartão de Crédito"
        [breadcrumbs]="breadcrumbs()"
        [actions]="pageHeaderActions()"
        (actionClick)="onPageHeaderActionClick($event)"
        (breadcrumbClick)="onBreadcrumbClick($event)"
      />

      <main class="credit-card-detail-page__content">
        <section class="credit-card-detail-page__card">
          <h2 class="credit-card-detail-page__card-title">Informações Básicas</h2>

          <div class="credit-card-detail-page__info-grid">
            <div class="info-item">
              <span class="info-item__label">ID:</span>
              <span class="info-item__value">{{ creditCard.id }}</span>
            </div>

            <div class="info-item">
              <span class="info-item__label">Nome:</span>
              <span class="info-item__value">{{ creditCard.name }}</span>
            </div>

            <div class="info-item">
              <span class="info-item__label">Limite:</span>
              <span class="info-item__value">{{ formatCurrency(creditCard.limit / 100) }}</span>
            </div>

            <div class="info-item">
              <span class="info-item__label">Dia de Fechamento:</span>
              <span class="info-item__value">Dia {{ creditCard.closingDay }}</span>
            </div>

            <div class="info-item">
              <span class="info-item__label">Dia de Vencimento:</span>
              <span class="info-item__value">Dia {{ creditCard.dueDay }}</span>
            </div>
          </div>
        </section>

        <section class="credit-card-detail-page__card">
          <h2 class="credit-card-detail-page__card-title">Faturas</h2>
          @if (bills().length === 0) {
          <div class="credit-card-detail-page__empty-bills">
            <p>Nenhuma fatura cadastrada para este cartão.</p>
            <os-button
              variant="primary"
              size="medium"
              icon="plus"
              (buttonClick)="navigateToCreateBill()"
              [attr.aria-label]="'Criar nova fatura'"
            >
              Criar Nova Fatura
            </os-button>
          </div>
          } @else {
          <div class="credit-card-detail-page__bills-list" role="list" aria-label="Lista de faturas">
            @for (bill of bills(); track bill.id) {
            <div class="credit-card-detail-page__bill-item" role="listitem">
              <div class="credit-card-detail-page__bill-info">
                <span class="credit-card-detail-page__bill-date">
                  Fechamento: {{ formatDate(bill.closingDate) }} | Vencimento:
                  {{ formatDate(bill.dueDate) }}
                </span>
                <span class="credit-card-detail-page__bill-amount">{{ formatCurrency(bill.amount / 100) }}</span>
                <span
                  class="credit-card-detail-page__bill-status"
                  [class.credit-card-detail-page__bill-status--paid]="bill.paid"
                  [class.credit-card-detail-page__bill-status--unpaid]="!bill.paid"
                >
                  {{ bill.paid ? 'Paga' : 'Pendente' }}
                </span>
              </div>
            </div>
            }
          </div>
          <div class="credit-card-detail-page__actions-section">
            <os-button
              variant="primary"
              size="medium"
              icon="plus"
              (buttonClick)="navigateToCreateBill()"
              [attr.aria-label]="'Criar nova fatura'"
            >
              Criar Nova Fatura
            </os-button>
          </div>
          }
        </section>
      </main>
      } @else {
      <os-page-header title="Cartão não encontrado" [breadcrumbs]="breadcrumbs()" />
      <os-alert
        type="warning"
        title="Cartão não encontrado"
        [role]="'alert'"
        [ariaLive]="'polite'"
        [showIcon]="true"
        [dismissible]="false"
      >
        O cartão que você está procurando não existe ou foi removido.
        <div class="credit-card-detail-page__error-action">
          <os-button
            variant="primary"
            size="medium"
            icon="arrow-left"
            (buttonClick)="navigateToList()"
            [attr.aria-label]="'Voltar para lista de cartões de crédito'"
          >
            Voltar para Lista
          </os-button>
        </div>
      </os-alert>
      } } } @if (showDeleteConfirmModal()) {
      <os-modal-template
        [config]="deleteModalConfig()"
        [variant]="'compact'"
        [size]="'small'"
        [disabled]="loading()"
        [loading]="loading()"
        [valid]="true"
        (actionClick)="onDeleteActionClick($event)"
        (cancelled)="onDeleteCancelled()"
        (closed)="onDeleteCancelled()"
      />
      }
    </os-page>
  `,
  styleUrl: './credit-card-detail.page.scss',
})
export class CreditCardDetailPage implements OnInit {
  private readonly creditCardState = inject(CreditCardState);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly localeService = inject(LocaleService);

  readonly loading = this.creditCardState.loading;
  readonly error = this.creditCardState.error;

  readonly creditCardId = signal<string | null>(null);
  readonly showDeleteConfirm = signal(false);

  readonly creditCard = computed(() => {
    const id = this.creditCardId();
    if (!id) return null;

    const creditCards = this.creditCardState.creditCards();
    return creditCards.find((cc) => cc.id === id) || null;
  });

  readonly bills = computed(() => {
    const id = this.creditCardId();
    if (!id) return [];
    return this.creditCardState.billsByCreditCardId(id);
  });

  readonly currentState = computed(() => {
    if (this.loading()) return 'loading';
    if (this.error()) return 'error';
    return 'success';
  });

  readonly errorMessage = computed(() => this.error() || 'Erro ao carregar cartão de crédito');

  readonly showDeleteConfirmModal = computed(() => {
    return this.showDeleteConfirm();
  });

  readonly deleteModalConfig = computed<ModalTemplateConfig>(() => {
    const creditCard = this.creditCard();
    return {
      title: 'Excluir Cartão de Crédito',
      subtitle: creditCard
        ? `Tem certeza que deseja excluir o cartão "${creditCard.name}"? Esta ação não pode ser desfeita.`
        : 'Tem certeza que deseja excluir este cartão? Esta ação não pode ser desfeita.',
      showActions: true,
      showCancelButton: true,
      showConfirmButton: false,
      cancelButtonText: 'Cancelar',
      actions: [
        {
          label: 'Excluir',
          variant: 'danger',
          size: 'medium',
          disabled: this.loading(),
          loading: this.loading(),
        },
      ],
    };
  });

  readonly breadcrumbs = computed((): BreadcrumbItem[] => [
    { label: 'Cartões de Crédito', route: '/credit-cards' },
    { label: this.creditCard()?.name || 'Detalhes', route: undefined },
  ]);

  readonly pageHeaderActions = computed((): PageHeaderAction[] => {
    const creditCard = this.creditCard();
    if (!creditCard) return [];

    return [
      {
        label: 'Editar',
        variant: 'secondary',
        size: 'medium',
        icon: 'edit',
      },
      {
        label: 'Excluir',
        variant: 'danger',
        size: 'medium',
        icon: 'trash',
      },
    ];
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      return;
    }

    this.creditCardId.set(id);

    if (this.creditCardState.creditCards().length === 0) {
      this.creditCardState.loadCreditCards();
    }
  }

  navigateToList(): void {
    this.router.navigate(['/credit-cards']);
  }

  navigateToEdit(): void {
    const id = this.creditCardId();
    if (id) {
      this.router.navigate(['/credit-cards', id, 'edit']);
    }
  }

  navigateToCreateBill(): void {
    this.router.navigate(['/credit-cards'], { queryParams: { createBill: true } });
  }

  formatCurrency(value: number): string {
    return this.localeService.formatCurrency(value, 'BRL');
  }

  formatDate(dateString: string): string {
    return this.localeService.formatDate(new Date(dateString));
  }

  confirmDelete(): void {
    this.showDeleteConfirm.set(true);
  }

  onDeleteActionClick(action: {
    label: string;
    variant: 'primary' | 'secondary' | 'tertiary' | 'danger';
    size: 'small' | 'medium' | 'large';
    disabled?: boolean;
    loading?: boolean;
    icon?: string;
  }): void {
    if (action.variant === 'danger' || action.label === 'Excluir') {
      this.onDeleteConfirmed();
    }
  }

  onDeleteConfirmed(): void {
    const creditCard = this.creditCard();
    if (!creditCard) {
      this.onDeleteCancelled();
      return;
    }

    this.creditCardState.deleteCreditCard({ id: creditCard.id });
    this.onDeleteCancelled();
    this.navigateToList();
  }

  onDeleteCancelled(): void {
    this.showDeleteConfirm.set(false);
  }

  onPageHeaderActionClick(action: PageHeaderAction): void {
    if (action.label === 'Editar') {
      this.navigateToEdit();
    } else if (action.label === 'Excluir') {
      this.confirmDelete();
    }
  }

  onBreadcrumbClick(breadcrumb: BreadcrumbItem): void {
    if (breadcrumb.route) {
      this.router.navigate([breadcrumb.route]);
    }
  }
}

