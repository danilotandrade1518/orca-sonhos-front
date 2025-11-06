import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { TransactionFormComponent } from './transaction-form.component';
import { TransactionsApiService } from '../../services/transactions-api.service';
import { NotificationService } from '@core/services/notification/notification.service';
import { BudgetSelectionService } from '@core/services/budget-selection/budget-selection.service';
import { EXTERNAL_AUTH_SERVICE_ADAPTER } from '@core/adapters/external-auth-service.adapter';
import { MockExternalAuthServiceAdapter } from '@core/services/auth/__mocks__/external-auth-service.adapter.mock';

describe('TransactionFormComponent', () => {
  let component: TransactionFormComponent;
  let fixture: ComponentFixture<TransactionFormComponent>;

  let transactionsApi: {
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
  };
  let notificationService: {
    showSuccess: ReturnType<typeof vi.fn>;
    showError: ReturnType<typeof vi.fn>;
    setLoading: ReturnType<typeof vi.fn>;
  };
  let budgetSelection: { selectedBudgetId: ReturnType<typeof signal<string | null>> };
  let selectedBudgetIdSignal: ReturnType<typeof signal<string | null>>;
  let mockAuthAdapter: MockExternalAuthServiceAdapter;

  beforeEach(async () => {
    transactionsApi = {
      create: vi.fn(),
      update: vi.fn(),
    };
    notificationService = {
      showSuccess: vi.fn(),
      showError: vi.fn(),
      setLoading: vi.fn(),
    };
    selectedBudgetIdSignal = signal<string | null>('budget-1');
    budgetSelection = {
      selectedBudgetId: selectedBudgetIdSignal,
    };
    mockAuthAdapter = new MockExternalAuthServiceAdapter();
    mockAuthAdapter.setMockUser({
      id: 'user-1',
      email: 'test@example.com',
      name: 'Test User',
      avatar: null,
      metadata: {},
    });

    await TestBed.configureTestingModule({
      imports: [TransactionFormComponent, ReactiveFormsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: TransactionsApiService, useValue: transactionsApi },
        { provide: NotificationService, useValue: notificationService },
        { provide: BudgetSelectionService, useValue: budgetSelection },
        {
          provide: EXTERNAL_AUTH_SERVICE_ADAPTER,
          useValue: mockAuthAdapter,
        },
        provideZonelessChangeDetection(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not submit when form is invalid and mark controls as touched', async () => {
    const savedSpy = vi.fn();
    component.saved.subscribe(savedSpy);

    await component.onSubmit();

    expect(savedSpy).not.toHaveBeenCalled();
    expect(transactionsApi.create).not.toHaveBeenCalled();
  });

  it('should create a transaction successfully (create mode)', async () => {
    const savedSpy = vi.fn();
    const cancelledSpy = vi.fn();
    component.saved.subscribe(savedSpy);
    component.cancelled.subscribe(cancelledSpy);

    component['descriptionControl']()?.setValue('Compra no supermercado');
    component['descriptionControl']()?.markAsTouched();
    component['amountControl']()?.setValue(123.45);
    component['amountControl']()?.markAsTouched();
    component['typeControl']()?.setValue('EXPENSE' as unknown);
    component['typeControl']()?.markAsTouched();
    component['accountIdControl']()?.setValue('account-1');
    component['accountIdControl']()?.markAsTouched();
    component['categoryIdControl']()?.setValue('category-1');
    component['categoryIdControl']()?.markAsTouched();

    transactionsApi.create.mockReturnValue(of({ id: 'tx-1' }));

    await component.onSubmit();

    expect(transactionsApi.create).toHaveBeenCalled();
    expect(notificationService.showSuccess).toHaveBeenCalled();
    expect(savedSpy).toHaveBeenCalled();
    expect(cancelledSpy).toHaveBeenCalled();
  });

  it('should update a transaction successfully (edit mode)', async () => {
    const tx = {
      id: 't1',
      description: 'Old desc',
      amount: 10,
      type: 'EXPENSE',
      accountId: 'a1',
      categoryId: 'c1',
    } as unknown;
    fixture.componentRef.setInput('transaction', tx);
    fixture.detectChanges();

    component['descriptionControl']()?.setValue('Nova desc');
    component['amountControl']()?.setValue(99.99);
    component['typeControl']()?.setValue('INCOME' as unknown);
    component['accountIdControl']()?.setValue('account-1');
    component['categoryIdControl']()?.setValue('category-1');

    transactionsApi.update.mockReturnValue(of({ data: { success: true } }));

    const savedSpy = vi.fn();
    component.saved.subscribe(savedSpy);

    await component.onSubmit();

    expect(transactionsApi.update).toHaveBeenCalled();
    expect(notificationService.showSuccess).toHaveBeenCalled();
    expect(savedSpy).toHaveBeenCalled();
  });

  it('should show error when user not authenticated', async () => {
    mockAuthAdapter.setMockUser(null);

    component['descriptionControl']()?.setValue('D');
    component['descriptionControl']()?.setValue('Compra teste');
    component['amountControl']()?.setValue(10);
    component['typeControl']()?.setValue('EXPENSE' as unknown);
    component['accountIdControl']()?.setValue('a1');
    component['categoryIdControl']()?.setValue('c1');

    await component.onSubmit();
    expect(notificationService.showError).toHaveBeenCalledWith('Usuário não autenticado');
    expect(transactionsApi.create).not.toHaveBeenCalled();
  });

  it('should show error when no budget selected', async () => {
    selectedBudgetIdSignal.set(null);

    component['descriptionControl']()?.setValue('Compra');
    component['amountControl']()?.setValue(10);
    component['typeControl']()?.setValue('EXPENSE' as unknown);
    component['accountIdControl']()?.setValue('a1');
    component['categoryIdControl']()?.setValue('c1');

    await component.onSubmit();
    expect(notificationService.showError).toHaveBeenCalledWith('Selecione um orçamento primeiro');
    expect(transactionsApi.create).not.toHaveBeenCalled();
  });

  it('should show error on API failure', async () => {
    component['descriptionControl']()?.setValue('Compra');
    component['amountControl']()?.setValue(10);
    component['typeControl']()?.setValue('EXPENSE' as unknown);
    component['accountIdControl']()?.setValue('a1');
    component['categoryIdControl']()?.setValue('c1');

    transactionsApi.create.mockReturnValue(throwError(() => new Error('Falha')));

    await component.onSubmit();
    expect(notificationService.showError).toHaveBeenCalled();
  });
});
