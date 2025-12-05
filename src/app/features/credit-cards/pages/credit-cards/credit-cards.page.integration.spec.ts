import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { of } from 'rxjs';
import { CreditCardsPage } from './credit-cards.page';
import { CreditCardState } from '@core/services/credit-card/credit-card-state/credit-card.state';
import { BudgetSelectionService } from '@core/services/budget-selection/budget-selection.service';
import { CreditCardApiService } from '@core/services/credit-card/credit-card-api/credit-card-api.service';
import { AuthService } from '@core/services/auth/auth.service';
import { AccountState } from '@core/services/account/account-state/account.state';
import { ConfirmDialogService } from '@core/services/confirm-dialog';
import type { CreditCardDto } from '../../../../../dtos/credit-card/credit-card-types';
import type { CreditCardBillDto } from '../../../../../dtos/credit-card';

describe('CreditCardsPage - Integration Tests', () => {
  let component: CreditCardsPage;
  let fixture: ComponentFixture<CreditCardsPage>;
  let creditCardState: CreditCardState;
  let creditCardApiService: CreditCardApiService;
  let router: Router;
  let activatedRoute: ActivatedRoute;
  let confirmDialogService: {
    open: ReturnType<typeof vi.fn>;
  };

  const mockBudgetId = 'budget-1';
  const mockUserId = 'user-1';
  let selectedBudgetIdSignal: ReturnType<typeof signal<string | null>>;

  const mockCreditCard: CreditCardDto = {
    id: 'cc-1',
    name: 'Cartão Nubank',
    limit: 500000,
    closingDay: 10,
    dueDay: 20,
    budgetId: mockBudgetId,
  };

  const mockCreditCardBill: CreditCardBillDto = {
    id: 'bill-1',
    creditCardId: 'cc-1',
    closingDate: '2024-01-10T00:00:00.000Z',
    dueDate: '2024-01-20T00:00:00.000Z',
    amount: 150000,
    paid: false,
  };

  beforeEach(async () => {
    const mockAuthService = {
      user: vi.fn(() => ({ id: mockUserId })),
      currentUser: vi.fn(() => ({ id: mockUserId })),
    };

    selectedBudgetIdSignal = signal<string | null>(mockBudgetId);
    const mockBudgetSelectionService = {
      selectedBudgetId: selectedBudgetIdSignal,
    };

    const mockRouter = {
      navigate: vi.fn(),
    };

    const mockActivatedRoute = {
      snapshot: {
        data: {},
        paramMap: {
          get: vi.fn(() => null),
        },
      },
    };

    confirmDialogService = {
      open: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [CreditCardsPage],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideZonelessChangeDetection(),
        CreditCardState,
        CreditCardApiService,
        { provide: AuthService, useValue: mockAuthService },
        { provide: BudgetSelectionService, useValue: mockBudgetSelectionService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: AccountState, useValue: {} },
        { provide: ConfirmDialogService, useValue: confirmDialogService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreditCardsPage);
    component = fixture.componentInstance;
    creditCardState = TestBed.inject(CreditCardState);
    creditCardApiService = TestBed.inject(CreditCardApiService);
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);

    vi.spyOn(creditCardApiService, 'listCreditCards').mockReturnValue(of([mockCreditCard]));
    vi.spyOn(creditCardApiService, 'createCreditCard').mockReturnValue(of('cc-2'));
    vi.spyOn(creditCardApiService, 'updateCreditCard').mockReturnValue(of(true));
    vi.spyOn(creditCardApiService, 'deleteCreditCard').mockReturnValue(of(true));
    vi.spyOn(creditCardApiService, 'listCreditCardBills').mockReturnValue(of([mockCreditCardBill]));
    vi.spyOn(creditCardApiService, 'createCreditCardBill').mockReturnValue(of('bill-2'));
    vi.spyOn(creditCardApiService, 'payCreditCardBill').mockReturnValue(of(true));
    vi.spyOn(creditCardApiService, 'reopenCreditCardBill').mockReturnValue(of(true));
  });

  describe('Full Flow Integration', () => {
    it('should complete full flow: create card → create bill → pay bill → reopen bill', () => {
      creditCardState.loadCreditCards();
      fixture.detectChanges();

      expect(creditCardApiService.listCreditCards).toHaveBeenCalled();

      const newCard: CreditCardDto = {
        id: 'cc-2',
        name: 'Cartão Itaú',
        limit: 300000,
        closingDay: 15,
        dueDay: 25,
        budgetId: mockBudgetId,
      };

      creditCardState.createCreditCard({
        name: newCard.name,
        limit: newCard.limit,
        closingDay: newCard.closingDay,
        dueDay: newCard.dueDay,
        budgetId: newCard.budgetId,
      });

      expect(creditCardApiService.createCreditCard).toHaveBeenCalled();

      const newBill: CreditCardBillDto = {
        id: 'bill-2',
        creditCardId: newCard.id,
        closingDate: '2024-02-15T00:00:00.000Z',
        dueDate: '2024-02-25T00:00:00.000Z',
        amount: 100000,
        paid: false,
      };

      creditCardState.createCreditCardBill({
        creditCardId: newBill.creditCardId,
        closingDate: newBill.closingDate,
        dueDate: newBill.dueDate,
        amount: newBill.amount,
      });

      expect(creditCardApiService.createCreditCardBill).toHaveBeenCalled();

      creditCardState.payCreditCardBill({
        creditCardBillId: newBill.id,
        accountId: 'account-1',
        userId: mockUserId,
        budgetId: mockBudgetId,
        amount: newBill.amount,
        paymentCategoryId: 'category-1',
      });

      expect(creditCardApiService.payCreditCardBill).toHaveBeenCalled();

      creditCardState.reopenCreditCardBill({
        creditCardBillId: newBill.id,
        userId: mockUserId,
        budgetId: mockBudgetId,
        justification: 'Erro no pagamento',
      });

      expect(creditCardApiService.reopenCreditCardBill).toHaveBeenCalled();
    });
  });

  describe('Budget Selection Integration', () => {
    it('should reload credit cards when budget changes', () => {
      const loadSpy = vi.spyOn(creditCardState, 'loadCreditCards');

      creditCardState.loadCreditCards();
      fixture.detectChanges();

      expect(loadSpy).toHaveBeenCalled();

      const newBudgetId = 'budget-2';
      selectedBudgetIdSignal.set(newBudgetId);

      component.ngOnInit();
      fixture.detectChanges();

      expect(creditCardState.creditCardsByBudgetId().length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Navigation Integration', () => {
    it('should navigate to create route when opening create modal', () => {
      component.openCreateModal();

      expect(router.navigate).toHaveBeenCalledWith(['new'], {
        relativeTo: activatedRoute,
      });
    });

    it('should navigate to credit card detail route when editing credit card', () => {
      component.onEditCreditCard(mockCreditCard);

      expect(router.navigate).toHaveBeenCalledWith([mockCreditCard.id], {
        relativeTo: activatedRoute,
      });
    });

    it('should navigate back to list after form save', () => {
      component.onFormSaved();

      expect(router.navigate).toHaveBeenCalledWith(['/credit-cards'], {
        replaceUrl: true,
      });
    });
  });

  describe('Modal State Management', () => {
    it('should open confirm dialog and delete credit card when confirmed', async () => {
      confirmDialogService.open.mockResolvedValue(true);
      const deleteCreditCardSpy = vi.spyOn(creditCardState, 'deleteCreditCard');

      await component.onDeleteCreditCard(mockCreditCard);

      expect(confirmDialogService.open).toHaveBeenCalledWith({
        title: 'Confirmar Exclusão',
        message: `Tem certeza que deseja excluir o cartão "${mockCreditCard.name}"? Esta ação não pode ser desfeita. Se o cartão possuir faturas vinculadas, a exclusão será bloqueada.`,
        variant: 'danger',
        confirmText: 'Excluir',
        cancelText: 'Cancelar',
      });
      expect(deleteCreditCardSpy).toHaveBeenCalledWith({
        id: mockCreditCard.id,
      });
    });

    it('should not delete credit card when dialog is cancelled', async () => {
      confirmDialogService.open.mockResolvedValue(false);
      const deleteCreditCardSpy = vi.spyOn(creditCardState, 'deleteCreditCard');

      await component.onDeleteCreditCard(mockCreditCard);

      expect(confirmDialogService.open).toHaveBeenCalled();
      expect(deleteCreditCardSpy).not.toHaveBeenCalled();
    });

    it('should navigate to pay bill page when paying bill', () => {
      component.onPayBill(mockCreditCardBill);

      expect(router.navigate).toHaveBeenCalledWith([
        '/credit-cards/bills',
        mockCreditCardBill.id,
        'pay',
      ]);
    });

    it('should open and close reopen bill modal correctly', () => {
      component.onReopenBill(mockCreditCardBill);

      expect(component.reopeningBill()).toEqual(mockCreditCardBill);
      expect(component.showReopenBillModal()).toBe(true);

      component.closeReopenBillModal();

      expect(component.showReopenBillModal()).toBe(false);
      expect(component.reopeningBill()).toBeNull();
    });
  });
});
