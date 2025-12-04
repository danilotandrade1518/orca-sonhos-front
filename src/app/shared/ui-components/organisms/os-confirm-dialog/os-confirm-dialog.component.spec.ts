import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { OsConfirmDialogComponent, ConfirmDialogData, ConfirmDialogVariant } from './os-confirm-dialog.component';

describe('OsConfirmDialogComponent', () => {
  let component: OsConfirmDialogComponent;
  let fixture: ComponentFixture<OsConfirmDialogComponent>;
  let mockDialogRef: { close: ReturnType<typeof vi.fn> };

  const createMockData = (overrides: Partial<ConfirmDialogData> = {}): ConfirmDialogData => ({
    title: 'Test Title',
    message: 'Test Message',
    variant: 'info',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    ...overrides,
  });

  beforeEach(async () => {
    mockDialogRef = {
      close: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [OsConfirmDialogComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: createMockData() },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OsConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Input Properties', () => {
    it('should initialize with default values when no data provided', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [OsConfirmDialogComponent],
        providers: [
          provideZonelessChangeDetection(),
          { provide: MatDialogRef, useValue: mockDialogRef },
          { provide: MAT_DIALOG_DATA, useValue: null },
        ],
      });

      const newFixture = TestBed.createComponent(OsConfirmDialogComponent);
      const newComponent = newFixture.componentInstance;
      newFixture.detectChanges();

      expect(newComponent.title()).toBe('Confirmar ação');
      expect(newComponent.message()).toBe('');
      expect(newComponent.variant()).toBe('info');
      expect(newComponent.confirmText()).toBe('Confirmar');
      expect(newComponent.cancelText()).toBe('Cancelar');
    });

    it('should initialize with provided data', () => {
      const mockData = createMockData({
        title: 'Custom Title',
        message: 'Custom Message',
        variant: 'danger',
        confirmText: 'Delete',
        cancelText: 'Abort',
      });

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [OsConfirmDialogComponent],
        providers: [
          provideZonelessChangeDetection(),
          { provide: MatDialogRef, useValue: mockDialogRef },
          { provide: MAT_DIALOG_DATA, useValue: mockData },
        ],
      });

      const newFixture = TestBed.createComponent(OsConfirmDialogComponent);
      const newComponent = newFixture.componentInstance;
      newFixture.detectChanges();

      expect(newComponent.title()).toBe('Custom Title');
      expect(newComponent.message()).toBe('Custom Message');
      expect(newComponent.variant()).toBe('danger');
      expect(newComponent.confirmText()).toBe('Delete');
      expect(newComponent.cancelText()).toBe('Abort');
    });
  });

  describe('Computed Properties', () => {
    describe('modalConfig', () => {
      it('should compute modal config correctly', () => {
        const config = component.modalConfig();
        expect(config.title).toBe('Test Title');
        expect(config.showHeader).toBe(true);
        expect(config.showFooter).toBe(true);
        expect(config.showActions).toBe(true);
        expect(config.showConfirmButton).toBe(true);
        expect(config.showCancelButton).toBe(true);
        expect(config.confirmButtonText).toBe('Confirmar');
        expect(config.cancelButtonText).toBe('Cancelar');
      });

      it('should update modal config when inputs change', () => {
        component.title.set('New Title');
        component.confirmText.set('Save');
        component.cancelText.set('Discard');
        fixture.detectChanges();

        const config = component.modalConfig();
        expect(config.title).toBe('New Title');
        expect(config.confirmButtonText).toBe('Save');
        expect(config.cancelButtonText).toBe('Discard');
      });
    });

    describe('contentClasses', () => {
      it('should compute content classes with default variant', () => {
        const classes = component.contentClasses();
        expect(classes).toContain('os-confirm-dialog__content');
        expect(classes).toContain('os-confirm-dialog__content--info');
      });

      it('should compute content classes with danger variant', () => {
        component.variant.set('danger');
        fixture.detectChanges();

        const classes = component.contentClasses();
        expect(classes).toContain('os-confirm-dialog__content--danger');
      });

      it('should compute content classes with warning variant', () => {
        component.variant.set('warning');
        fixture.detectChanges();

        const classes = component.contentClasses();
        expect(classes).toContain('os-confirm-dialog__content--warning');
      });
    });

    describe('alertClasses', () => {
      it('should compute alert classes with default variant', () => {
        const classes = component.alertClasses();
        expect(classes).toContain('os-confirm-dialog__alert');
        expect(classes).toContain('os-confirm-dialog__alert--info');
      });

      it('should compute alert classes with danger variant', () => {
        component.variant.set('danger');
        fixture.detectChanges();

        const classes = component.alertClasses();
        expect(classes).toContain('os-confirm-dialog__alert--danger');
      });

      it('should compute alert classes with warning variant', () => {
        component.variant.set('warning');
        fixture.detectChanges();

        const classes = component.alertClasses();
        expect(classes).toContain('os-confirm-dialog__alert--warning');
      });
    });

    describe('iconName', () => {
      it('should return correct icon for danger variant', () => {
        component.variant.set('danger');
        fixture.detectChanges();

        expect(component.iconName()).toBe('error_outline');
      });

      it('should return correct icon for warning variant', () => {
        component.variant.set('warning');
        fixture.detectChanges();

        expect(component.iconName()).toBe('warning_amber');
      });

      it('should return correct icon for info variant', () => {
        component.variant.set('info');
        fixture.detectChanges();

        expect(component.iconName()).toBe('info_outline');
      });
    });

    describe('iconVariant', () => {
      it('should return correct icon variant for danger', () => {
        component.variant.set('danger');
        fixture.detectChanges();

        expect(component.iconVariant()).toBe('error');
      });

      it('should return correct icon variant for warning', () => {
        component.variant.set('warning');
        fixture.detectChanges();

        expect(component.iconVariant()).toBe('warning');
      });

      it('should return correct icon variant for info', () => {
        component.variant.set('info');
        fixture.detectChanges();

        expect(component.iconVariant()).toBe('info');
      });
    });
  });

  describe('Event Handling', () => {
    describe('onConfirm', () => {
      it('should emit confirmed event', () => {
        let emitted = false;
        component.confirmed.subscribe(() => {
          emitted = true;
        });

        component.onConfirm();

        expect(emitted).toBe(true);
      });

      it('should close dialog with true', () => {
        component.onConfirm();

        expect(mockDialogRef.close).toHaveBeenCalledWith(true);
      });
    });

    describe('onCancel', () => {
      it('should emit cancelled event', () => {
        let emitted = false;
        component.cancelled.subscribe(() => {
          emitted = true;
        });

        component.onCancel();

        expect(emitted).toBe(true);
      });

      it('should close dialog with false', () => {
        component.onCancel();

        expect(mockDialogRef.close).toHaveBeenCalledWith(false);
      });
    });
  });

  describe('Rendering', () => {
    it('should render title', () => {
      component.title.set('Test Title');
      fixture.detectChanges();

      const modalTemplate = fixture.nativeElement.querySelector('os-modal-template');
      expect(modalTemplate).toBeTruthy();
    });

    it('should render message', () => {
      component.message.set('Test Message');
      fixture.detectChanges();

      const messageElement = fixture.nativeElement.querySelector('.os-confirm-dialog__message');
      expect(messageElement).toBeTruthy();
      expect(messageElement.textContent.trim()).toBe('Test Message');
    });

    it('should render alert with correct variant class', () => {
      component.variant.set('danger');
      fixture.detectChanges();

      const alertElement = fixture.nativeElement.querySelector('.os-confirm-dialog__alert');
      expect(alertElement).toBeTruthy();
      expect(alertElement.classList.contains('os-confirm-dialog__alert--danger')).toBe(true);
    });

    it('should render icon with correct name', () => {
      component.variant.set('warning');
      fixture.detectChanges();

      const iconElement = fixture.nativeElement.querySelector('os-icon');
      expect(iconElement).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have role="alert" on alert element', () => {
      fixture.detectChanges();

      const alertElement = fixture.nativeElement.querySelector('.os-confirm-dialog__alert');
      expect(alertElement).toBeTruthy();
      expect(alertElement.getAttribute('role')).toBe('alert');
    });

    it('should have accessible message', () => {
      component.message.set('Are you sure you want to delete this item?');
      fixture.detectChanges();

      const messageElement = fixture.nativeElement.querySelector('.os-confirm-dialog__message');
      expect(messageElement).toBeTruthy();
      expect(messageElement.textContent).toContain('Are you sure you want to delete this item?');
    });
  });

  describe('Variants', () => {
    const variants: ConfirmDialogVariant[] = ['danger', 'warning', 'info'];

    variants.forEach((variant) => {
      it(`should render correctly with ${variant} variant`, () => {
        component.variant.set(variant);
        fixture.detectChanges();

        const alertElement = fixture.nativeElement.querySelector('.os-confirm-dialog__alert');
        expect(alertElement).toBeTruthy();
        expect(alertElement.classList.contains(`os-confirm-dialog__alert--${variant}`)).toBe(true);
      });
    });
  });
});

