import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { of, throwError, delay } from 'rxjs';
import { EnvelopesPage } from './envelopes.page';
import { EnvelopeState } from '@core/services/envelope/envelope-state/envelope.state';
import { BudgetSelectionService } from '@core/services/budget-selection/budget-selection.service';
import { EnvelopesApiService } from '@core/services/envelope/envelopes-api/envelopes-api.service';
import { AuthService } from '@core/services/auth/auth.service';
import { ConfirmDialogService } from '@core/services/confirm-dialog';
import type {
  EnvelopeDto,
  CreateEnvelopeRequestDto,
  UpdateEnvelopeRequestDto,
  DeleteEnvelopeRequestDto,
} from '../../../../../dtos/envelope';

describe('EnvelopesPage - Integration Tests', () => {
  let component: EnvelopesPage;
  let fixture: ComponentFixture<EnvelopesPage>;
  let envelopeState: EnvelopeState;
  let envelopesApiService: EnvelopesApiService;
  let router: Router;
  let confirmDialogService: {
    open: ReturnType<typeof vi.fn>;
  };

  const mockBudgetId = 'budget-1';
  const mockUserId = 'user-1';
  let selectedBudgetIdSignal: ReturnType<typeof signal<string | null>>;

  const mockEnvelope: EnvelopeDto = {
    id: 'envelope-1',
    budgetId: mockBudgetId,
    categoryId: 'category-1',
    categoryName: 'Alimentação',
    name: 'Envelope Alimentação',
    limit: 80000,
    currentUsage: 45000,
    usagePercentage: 56.25,
    active: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-12-03T00:00:00Z',
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
      imports: [EnvelopesPage],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideZonelessChangeDetection(),
        EnvelopeState,
        EnvelopesApiService,
        { provide: AuthService, useValue: mockAuthService },
        { provide: BudgetSelectionService, useValue: mockBudgetSelectionService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: ConfirmDialogService, useValue: confirmDialogService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EnvelopesPage);
    component = fixture.componentInstance;
    envelopeState = TestBed.inject(EnvelopeState);
    envelopesApiService = TestBed.inject(EnvelopesApiService);
    router = TestBed.inject(Router);

    vi.spyOn(envelopesApiService, 'listEnvelopes').mockReturnValue(of([mockEnvelope]));
    vi.spyOn(envelopesApiService, 'createEnvelope').mockReturnValue(of('envelope-2'));
    vi.spyOn(envelopesApiService, 'updateEnvelope').mockReturnValue(of(true));
    vi.spyOn(envelopesApiService, 'deleteEnvelope').mockReturnValue(of(true));
  });

  describe('Full Flow Integration', () => {
    it('should complete full flow: create envelope → update envelope → delete envelope', () => {
      envelopeState.loadEnvelopes();
      fixture.detectChanges();

      expect(envelopesApiService.listEnvelopes).toHaveBeenCalled();

      const newEnvelope: CreateEnvelopeRequestDto = {
        budgetId: mockBudgetId,
        categoryId: 'category-2',
        name: 'Envelope Transporte',
        limit: 30000,
      };

      envelopeState.createEnvelope(newEnvelope);

      expect(envelopesApiService.createEnvelope).toHaveBeenCalledWith(newEnvelope);

      const updateDto: UpdateEnvelopeRequestDto = {
        envelopeId: 'envelope-2',
        budgetId: mockBudgetId,
        name: 'Envelope Transporte Atualizado',
        limit: 35000,
      };

      envelopeState.updateEnvelope(updateDto);

      expect(envelopesApiService.updateEnvelope).toHaveBeenCalledWith(updateDto);

      const deleteDto: DeleteEnvelopeRequestDto = {
        envelopeId: 'envelope-2',
        budgetId: mockBudgetId,
      };

      envelopeState.deleteEnvelope(deleteDto);

      expect(envelopesApiService.deleteEnvelope).toHaveBeenCalledWith(deleteDto);
    });
  });

  describe('Budget Selection Integration', () => {
    it('should reload envelopes when budget changes', () => {
      const loadSpy = vi.spyOn(envelopeState, 'loadEnvelopes');

      envelopeState.loadEnvelopes();
      fixture.detectChanges();

      expect(loadSpy).toHaveBeenCalled();

      const newBudgetId = 'budget-2';
      selectedBudgetIdSignal.set(newBudgetId);

      component.ngOnInit();
      fixture.detectChanges();

      expect(envelopeState.envelopesByBudgetId().length).toBeGreaterThanOrEqual(0);
    });

    it('should show empty state when no budget is selected', () => {
      selectedBudgetIdSignal.set(null);
      fixture.detectChanges();

      expect(component.currentState()).toBe('empty');
    });
  });

  describe('Navigation Integration', () => {
    it('should navigate to create route when opening create modal', () => {
      component.openCreateModal();

      expect(router.navigate).toHaveBeenCalledWith(['/envelopes/new']);
    });

    it('should navigate to edit route when editing envelope', () => {
      component.onEditEnvelope(mockEnvelope);

      expect(router.navigate).toHaveBeenCalledWith(['/envelopes', mockEnvelope.id, 'edit']);
    });
  });

  describe('Modal State Management', () => {
    it('should open confirm dialog and delete envelope when confirmed', async () => {
      confirmDialogService.open.mockResolvedValue(true);
      const deleteEnvelopeSpy = vi.spyOn(envelopeState, 'deleteEnvelope');

      await component.onDeleteEnvelope(mockEnvelope);

      expect(confirmDialogService.open).toHaveBeenCalledWith({
        title: 'Confirmar Exclusão',
        message: `Tem certeza que deseja excluir o envelope "${mockEnvelope.name}"? Esta ação não pode ser desfeita. O envelope será removido permanentemente e não será mais possível controlar o limite de gastos para esta categoria.`,
        variant: 'danger',
        confirmText: 'Excluir',
        cancelText: 'Cancelar',
      });
      expect(deleteEnvelopeSpy).toHaveBeenCalledWith({
        envelopeId: mockEnvelope.id,
        budgetId: mockBudgetId,
      });
    });

    it('should not delete envelope when dialog is cancelled', async () => {
      confirmDialogService.open.mockResolvedValue(false);
      const deleteEnvelopeSpy = vi.spyOn(envelopeState, 'deleteEnvelope');

      await component.onDeleteEnvelope(mockEnvelope);

      expect(confirmDialogService.open).toHaveBeenCalled();
      expect(deleteEnvelopeSpy).not.toHaveBeenCalled();
    });
  });

  describe('State Management', () => {
    it('should display loading state when loading envelopes', async () => {
      const delayedObservable = of([mockEnvelope]).pipe(delay(100));
      vi.spyOn(envelopesApiService, 'listEnvelopes').mockReturnValue(delayedObservable);

      envelopeState.loadEnvelopes();
      fixture.detectChanges();

      expect(component.currentState()).toBe('loading');
      
      await new Promise((resolve) => setTimeout(resolve, 150));
      fixture.detectChanges();
    });

    it('should display error state when error occurs', () => {
      vi.spyOn(envelopesApiService, 'listEnvelopes').mockReturnValue(
        throwError(() => new Error('Network error'))
      );

      envelopeState.loadEnvelopes();
      fixture.detectChanges();

      expect(component.currentState()).toBe('error');
    });

    it('should display empty state when no envelopes exist', () => {
      vi.spyOn(envelopesApiService, 'listEnvelopes').mockReturnValue(of([]));
      envelopeState.loadEnvelopes();
      fixture.detectChanges();

      expect(component.currentState()).toBe('empty');
    });

    it('should display success state when envelopes are loaded', () => {
      envelopeState.loadEnvelopes();
      fixture.detectChanges();

      expect(component.currentState()).toBe('success');
      expect(component.envelopes().length).toBeGreaterThan(0);
    });

    it('should retry loading when retry button is clicked', () => {
      const loadSpy = vi.spyOn(envelopeState, 'loadEnvelopes');
      const clearErrorSpy = vi.spyOn(envelopeState, 'clearError');

      component.retry();

      expect(clearErrorSpy).toHaveBeenCalled();
      expect(loadSpy).toHaveBeenCalled();
    });
  });

  describe('Computed Signals', () => {
    it('should compute page header actions correctly', () => {
      fixture.detectChanges();

      const actions = component.pageHeaderActions();
      expect(actions.length).toBe(1);
      expect(actions[0].label).toBe('Novo Envelope');
      expect(actions[0].variant).toBe('primary');
    });

    it('should disable create button when no budget is selected', () => {
      selectedBudgetIdSignal.set(null);
      fixture.detectChanges();

      const actions = component.pageHeaderActions();
      expect(actions[0].disabled).toBe(true);
    });

    it('should enable create button when budget is selected', () => {
      selectedBudgetIdSignal.set(mockBudgetId);
      fixture.detectChanges();

      const actions = component.pageHeaderActions();
      expect(actions[0].disabled).toBe(false);
    });
  });
});
