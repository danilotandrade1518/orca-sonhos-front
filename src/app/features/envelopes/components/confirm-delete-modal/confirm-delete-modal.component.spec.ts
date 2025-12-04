import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { signal } from '@angular/core';
import { ConfirmDeleteEnvelopeModalComponent } from './confirm-delete-modal.component';
import { EnvelopeDto } from '../../../../../dtos/envelope';
import { EnvelopeState } from '@core/services/envelope/envelope-state/envelope.state';
import { BudgetSelectionService } from '@core/services/budget-selection/budget-selection.service';
import { NotificationService } from '@core/services/notification/notification.service';
import { OsModalTemplateComponent } from '@shared/ui-components/templates/os-modal-template/os-modal-template.component';

describe('ConfirmDeleteEnvelopeModalComponent', () => {
  let component: ConfirmDeleteEnvelopeModalComponent;
  let fixture: ComponentFixture<ConfirmDeleteEnvelopeModalComponent>;
  let envelopeState: {
    loading: ReturnType<typeof signal<boolean>>;
    error: ReturnType<typeof signal<string | null>>;
    deleteEnvelope: ReturnType<typeof vi.fn>;
    clearError: ReturnType<typeof vi.fn>;
  };
  let budgetSelection: {
    selectedBudgetId: ReturnType<typeof signal<string | null>>;
  };
  let notificationService: {
    showSuccess: ReturnType<typeof vi.fn>;
    showError: ReturnType<typeof vi.fn>;
  };

  const mockEnvelope: EnvelopeDto = {
    id: 'envelope-1',
    budgetId: 'budget-1',
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
    envelopeState = {
      loading: signal(false),
      error: signal(null),
      deleteEnvelope: vi.fn(),
      clearError: vi.fn(),
    };

    budgetSelection = {
      selectedBudgetId: signal('budget-1'),
    };

    notificationService = {
      showSuccess: vi.fn(),
      showError: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ConfirmDeleteEnvelopeModalComponent, OsModalTemplateComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: EnvelopeState, useValue: envelopeState },
        { provide: BudgetSelectionService, useValue: budgetSelection },
        { provide: NotificationService, useValue: notificationService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDeleteEnvelopeModalComponent);
    component = fixture.componentInstance;
    component.envelope = signal(mockEnvelope);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Modal Config', () => {
    it('should have correct modal configuration', () => {
      const config = component.modalConfig();
      expect(config.title).toBe('Confirmar Exclusão');
      expect(config.subtitle).toBe('Esta ação não pode ser desfeita');
      expect(config.confirmButtonText).toBe('Excluir');
      expect(config.cancelButtonText).toBe('Cancelar');
    });
  });

  describe('Processing State', () => {
    it('should reflect loading state from envelopeState', () => {
      expect(component.isProcessing()).toBe(false);

      envelopeState.loading.set(true);
      fixture.detectChanges();

      expect(component.isProcessing()).toBe(true);
    });
  });

  describe('Confirm Delete', () => {
    it('should call deleteEnvelope with correct parameters', () => {
      component.onConfirm();

      expect(envelopeState.clearError).toHaveBeenCalled();
      expect(envelopeState.deleteEnvelope).toHaveBeenCalledWith({
        envelopeId: 'envelope-1',
        budgetId: 'budget-1',
      });
    });

    it('should show error if envelope is null', () => {
      component.envelope = signal(null);
      fixture.detectChanges();

      component.onConfirm();

      expect(notificationService.showError).toHaveBeenCalledWith(
        'Dados inválidos para exclusão',
        'Erro'
      );
      expect(envelopeState.deleteEnvelope).not.toHaveBeenCalled();
    });

    it('should show error if budgetId is null', () => {
      budgetSelection.selectedBudgetId = signal(null);

      component.onConfirm();

      expect(notificationService.showError).toHaveBeenCalledWith(
        'Dados inválidos para exclusão',
        'Erro'
      );
      expect(envelopeState.deleteEnvelope).not.toHaveBeenCalled();
    });
  });

  describe('Close', () => {
    it('should clear error and emit closed event', () => {
      const closedSpy = vi.fn();
      component.closed.subscribe(closedSpy);

      component.onClose();

      expect(envelopeState.clearError).toHaveBeenCalled();
      expect(closedSpy).toHaveBeenCalled();
    });
  });

  describe('Success Handling', () => {
    it('should show success message when deletion completes successfully', () => {
      component['deleteInitiated'].set(true);
      component['previousLoading'].set(true);
      envelopeState.loading.set(false);
      envelopeState.error.set(null);

      fixture.detectChanges();

      expect(notificationService.showSuccess).toHaveBeenCalledWith(
        'Envelope excluído com sucesso!'
      );
      expect(component['deleteInitiated']()).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should show error message when deletion fails', () => {
      component['deleteInitiated'].set(true);
      component['previousLoading'].set(true);
      envelopeState.loading.set(false);
      envelopeState.error.set('Erro ao excluir envelope');

      fixture.detectChanges();

      expect(notificationService.showError).toHaveBeenCalledWith('Erro ao excluir envelope', 'Erro ao excluir');
    });
  });
});

