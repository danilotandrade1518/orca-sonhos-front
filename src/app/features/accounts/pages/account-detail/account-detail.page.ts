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
import { AccountState } from '@core/services/account/account-state/account.state';
import { AuthService } from '@core/services/auth/auth.service';
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
  selector: 'os-account-detail-page',
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
    <os-page variant="default" size="medium" ariaLabel="Detalhes da conta">
      @switch (currentState()) { @case ('loading') {
      <os-page-header title="Carregando..." [breadcrumbs]="breadcrumbs()" />
      <div
        class="account-detail-page__loading"
        role="status"
        aria-live="polite"
        aria-label="Carregando detalhes da conta"
      >
        <os-skeleton variant="card" size="lg" />
        <os-skeleton variant="card" size="lg" />
      </div>
      } @case ('error') {
      <os-page-header title="Erro" [breadcrumbs]="breadcrumbs()" />
      <os-alert
        type="error"
        [title]="'Erro ao carregar conta'"
        [role]="'alert'"
        [ariaLive]="'assertive'"
        [showIcon]="true"
        [dismissible]="false"
      >
        {{ errorMessage() }}
        <div class="account-detail-page__error-action">
          <os-button
            variant="primary"
            size="medium"
            icon="arrow-left"
            (buttonClick)="navigateToList()"
            [attr.aria-label]="'Voltar para lista de contas'"
          >
            Voltar para Lista
          </os-button>
        </div>
      </os-alert>
      } @default { @if (account(); as account) {
      <os-page-header
        [title]="account.name"
        [subtitle]="getAccountTypeLabel(account.type)"
        [breadcrumbs]="breadcrumbs()"
        [actions]="pageHeaderActions()"
        (actionClick)="onPageHeaderActionClick($event)"
        (breadcrumbClick)="onBreadcrumbClick($event)"
      />

      <main class="account-detail-page__content">
        <section class="account-detail-page__card">
          <h2 class="account-detail-page__card-title">Informações Básicas</h2>

          <div class="account-detail-page__info-grid">
            <div class="info-item">
              <span class="info-item__label">ID:</span>
              <span class="info-item__value">{{ account.id }}</span>
            </div>

            <div class="info-item">
              <span class="info-item__label">Nome:</span>
              <span class="info-item__value">{{ account.name }}</span>
            </div>

            <div class="info-item">
              <span class="info-item__label">Tipo:</span>
              <span class="info-item__value">{{ getAccountTypeLabel(account.type) }}</span>
            </div>

            <div class="info-item">
            <span class="info-item__label">Saldo:</span>
            <span class="info-item__value">{{ formatCurrency(account.balance / 100) }}</span>
            </div>
          </div>
        </section>

        <section class="account-detail-page__card">
          <h2 class="account-detail-page__card-title">Ações</h2>
          <div class="account-detail-page__actions-section">
            <os-button
              variant="secondary"
              size="medium"
              icon="check_circle"
              (buttonClick)="navigateToReconcile()"
              [attr.aria-label]="'Reconciliar conta ' + account.name"
            >
              Reconciliar
            </os-button>
            <os-button
              variant="secondary"
              size="medium"
              icon="receipt"
              (buttonClick)="navigateToTransactions()"
              [attr.aria-label]="'Ver transações da conta ' + account.name"
            >
              Ver Transações
            </os-button>
          </div>
        </section>
      </main>
      } @else {
      <os-page-header title="Conta não encontrada" [breadcrumbs]="breadcrumbs()" />
      <os-alert
        type="warning"
        title="Conta não encontrada"
        [role]="'alert'"
        [ariaLive]="'polite'"
        [showIcon]="true"
        [dismissible]="false"
      >
        A conta que você está procurando não existe ou foi removida.
        <div class="account-detail-page__error-action">
          <os-button
            variant="primary"
            size="medium"
            icon="arrow-left"
            (buttonClick)="navigateToList()"
            [attr.aria-label]="'Voltar para lista de contas'"
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
  styleUrl: './account-detail.page.scss',
})
export class AccountDetailPage implements OnInit {
  private readonly accountState = inject(AccountState);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly localeService = inject(LocaleService);

  readonly loading = this.accountState.loading;
  readonly error = this.accountState.error;
  readonly currentUser = this.authService.currentUser;

  readonly accountId = signal<string | null>(null);
  readonly showDeleteConfirm = signal(false);

  readonly account = computed(() => {
    const id = this.accountId();
    if (!id) return null;

    const accounts = this.accountState.accounts();
    return accounts.find((a) => a.id === id) || null;
  });

  readonly currentState = computed(() => {
    if (this.loading()) return 'loading';
    if (this.error()) return 'error';
    return 'success';
  });

  readonly errorMessage = computed(() => this.error() || 'Erro ao carregar conta');

  readonly showDeleteConfirmModal = computed(() => {
    return this.showDeleteConfirm();
  });

  readonly deleteModalConfig = computed<ModalTemplateConfig>(() => {
    const account = this.account();
    return {
      title: 'Excluir Conta',
      subtitle: account
        ? `Tem certeza que deseja excluir a conta "${account.name}"? Esta ação não pode ser desfeita.`
        : 'Tem certeza que deseja excluir esta conta? Esta ação não pode ser desfeita.',
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
    { label: 'Contas', route: '/accounts' },
    { label: this.account()?.name || 'Detalhes', route: undefined },
  ]);

  readonly pageHeaderActions = computed((): PageHeaderAction[] => {
    const account = this.account();
    if (!account) return [];

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

    this.accountId.set(id);

    if (this.accountState.accounts().length === 0) {
      this.accountState.loadAccounts();
    }
  }

  navigateToList(): void {
    this.router.navigate(['/accounts']);
  }

  navigateToEdit(): void {
    const id = this.accountId();
    if (id) {
      this.router.navigate(['/accounts', id, 'edit']);
    }
  }

  navigateToReconcile(): void {
    const id = this.accountId();
    if (id) {
      this.router.navigate(['/accounts', id, 'reconcile']);
    }
  }

  navigateToTransactions(): void {
    const id = this.accountId();
    if (id) {
      this.router.navigate(['/transactions'], { queryParams: { accountId: id } });
    }
  }

  getAccountTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      CHECKING_ACCOUNT: 'Conta Corrente',
      SAVINGS_ACCOUNT: 'Poupança',
      PHYSICAL_WALLET: 'Carteira Física',
      DIGITAL_WALLET: 'Carteira Digital',
      INVESTMENT_ACCOUNT: 'Investimento',
      OTHER: 'Outros',
    };
    return labels[type] || type;
  }

  formatCurrency(value: number): string {
    return this.localeService.formatCurrency(value, 'BRL');
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
    const account = this.account();
    const user = this.currentUser();
    if (!account || !user) {
      this.onDeleteCancelled();
      return;
    }

    this.accountState.deleteAccount({ userId: user.id, accountId: account.id });
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
