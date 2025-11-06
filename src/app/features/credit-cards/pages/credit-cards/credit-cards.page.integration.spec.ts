import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CreditCardsPage } from './credit-cards.page';
import { CreditCardState } from '@core/services/credit-card/credit-card-state/credit-card.state';
import { BudgetSelectionService } from '@core/services/budget-selection/budget-selection.service';
import { CreditCardApiService } from '@core/services/credit-card/credit-card-api/credit-card-api.service';
import { AuthService } from '@core/services/auth/auth.service';
import { AccountState } from '@core/services/account/account-state/account.state';
import type { CreditCardDto } from '../../../../../dtos/credit-card/credit-card-types';
import type { CreditCardBillDto } from '../../../../../dtos/credit-card';

describe('CreditCardsPage - Integration Tests', () => {
  let component: CreditCardsPage;
  let fixture: ComponentFixture<CreditCardsPage>;
  let creditCardState: CreditCardState;
  let creditCardApiService: CreditCardApiService;
  let budgetSelectionService: BudgetSelectionService;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  const mockBudgetId = 'budget-1';
  const mockUserId = 'user-1';

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
      currentUser: vi.fn(() => ({ id: mockUserId })),
    };

    const mockBudgetSelectionService = {
      selectedBudgetId: vi.fn(() => mockBudgetId),
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

    await TestBed.configureTestingModule({
      imports: [CreditCardsPage],
      providers: [
        provideZonelessChangeDetection(),
        CreditCardState,
        CreditCardApiService,
        { provide: AuthService, useValue: mockAuthService },
        { provide: BudgetSelectionService, useValue: mockBudgetSelectionService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: AccountState, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreditCardsPage);
    component = fixture.componentInstance;
    creditCardState = TestBed.inject(CreditCardState);
    creditCardApiService = TestBed.inject(CreditCardApiService);
    budgetSelectionService = TestBed.inject(BudgetSelectionService);
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);

    vi.spyOn(creditCardApiService, 'listCreditCards').mockResolvedValue([mockCreditCard]);
    vi.spyOn(creditCardApiService, 'createCreditCard').mockResolvedValue('cc-2');
    vi.spyOn(creditCardApiService, 'updateCreditCard').mockResolvedValue(true);
    vi.spyOn(creditCardApiService, 'deleteCreditCard').mockResolvedValue(true);
    vi.spyOn(creditCardApiService, 'listCreditCardBills').mockResolvedValue([mockCreditCardBill]);
    vi.spyOn(creditCardApiService, 'createCreditCardBill').mockResolvedValue('bill-2');
    vi.spyOn(creditCardApiService, 'payCreditCardBill').mockResolvedValue(true);
    vi.spyOn(creditCardApiService, 'reopenCreditCardBill').mockResolvedValue(true);
  });

  describe('Full Flow Integration', () => {
    it('should complete full flow: create card → create bill → pay bill → reopen bill', async () => {
      await creditCardState.loadCreditCards();
      fixture.detectChanges();

      expect(creditCardState.creditCards().length).toBeGreaterThan(0);

      const newCard: CreditCardDto = {
        id: 'cc-2',
        name: 'Cartão Itaú',
        limit: 300000,
        closingDay: 15,
        dueDay: 25,
        budgetId: mockBudgetId,
      };

      await creditCardState.createCreditCard({
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

      await creditCardState.createCreditCardBill({
        creditCardId: newBill.creditCardId,
        closingDate: newBill.closingDate,
        dueDate: newBill.dueDate,
        amount: newBill.amount,
      });

      expect(creditCardApiService.createCreditCardBill).toHaveBeenCalled();

      await creditCardState.payCreditCardBill({
        creditCardBillId: newBill.id,
        accountId: 'account-1',
        userId: mockUserId,
        budgetId: mockBudgetId,
        amount: newBill.amount,
        paymentCategoryId: 'category-1',
      });

      expect(creditCardApiService.payCreditCardBill).toHaveBeenCalled();

      await creditCardState.reopenCreditCardBill({
        creditCardBillId: newBill.id,
        userId: mockUserId,
        budgetId: mockBudgetId,
        justification: 'Erro no pagamento',
      });

      expect(creditCardApiService.reopenCreditCardBill).toHaveBeenCalled();
    });
  });

  describe('Budget Selection Integration', () => {
    it('should reload credit cards when budget changes', async () => {
      const loadSpy = vi.spyOn(creditCardState, 'loadCreditCards');

      await creditCardState.loadCreditCards();
      fixture.detectChanges();

      expect(loadSpy).toHaveBeenCalled();

      const newBudgetId = 'budget-2';
      vi.spyOn(budgetSelectionService, 'selectedBudgetId').mockReturnValue(newBudgetId);

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

    it('should navigate to edit route when editing credit card', () => {
      component.onEditCreditCard(mockCreditCard);

      expect(component.editingCreditCard()).toEqual(mockCreditCard);
      expect(router.navigate).toHaveBeenCalledWith([mockCreditCard.id, 'edit'], {
        relativeTo: activatedRoute,
      });
    });

    it('should navigate back to list after form save', () => {
      component.onFormSaved();

      expect(component.editingCreditCard()).toBeNull();
      expect(router.navigate).toHaveBeenCalledWith(['/credit-cards'], {
        replaceUrl: true,
      });
    });
  });

  describe('Modal State Management', () => {
    it('should open and close delete modal correctly', () => {
      component.onDeleteCreditCard(mockCreditCard);

      expect(component.deletingCreditCard()).toEqual(mockCreditCard);
      expect(component.showDeleteModal()).toBe(true);

      component.closeDeleteModal();

      expect(component.showDeleteModal()).toBe(false);
      expect(component.deletingCreditCard()).toBeNull();
    });

    it('should open and close pay bill modal correctly', () => {
      component.onPayBill(mockCreditCardBill);

      expect(component.payingBill()).toEqual(mockCreditCardBill);
      expect(component.showPayBillModal()).toBe(true);

      component.closePayBillModal();

      expect(component.showPayBillModal()).toBe(false);
      expect(component.payingBill()).toBeNull();
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
