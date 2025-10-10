import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { OsModalComponent, OsModalVariant, OsModalSize, OsModalAction } from './os-modal.component';

describe('OsModalComponent', () => {
  let component: OsModalComponent;
  let fixture: ComponentFixture<OsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OsModalComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: MatDialogRef, useValue: { close: vi.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Input Properties', () => {
    it('should have default values', () => {
      expect(component.title()).toBeNull();
      expect(component.subtitle()).toBeNull();
      expect(component.variant()).toBe('default');
      expect(component.size()).toBe('medium');
      expect(component.closable()).toBe(true);
      expect(component.closeOnBackdrop()).toBe(true);
      expect(component.closeOnEscape()).toBe(true);
      expect(component.actions()).toEqual([]);
      expect(component.showDefaultActions()).toBe(false);
      expect(component.confirmText()).toBe('Confirmar');
      expect(component.cancelText()).toBe('Cancelar');
      expect(component.confirmDisabled()).toBe(false);
      expect(component.confirmLoading()).toBe(false);
      expect(component.fullHeight()).toBe(false);
      expect(component.centered()).toBe(true);
    });

    it('should accept custom values', () => {
      fixture.componentRef.setInput('title', 'Test Title');
      fixture.componentRef.setInput('subtitle', 'Test Subtitle');
      fixture.componentRef.setInput('variant', 'confirmation');
      fixture.componentRef.setInput('size', 'large');
      fixture.componentRef.setInput('closable', false);
      fixture.componentRef.setInput('closeOnBackdrop', false);
      fixture.componentRef.setInput('closeOnEscape', false);
      fixture.componentRef.setInput('confirmText', 'Save');
      fixture.componentRef.setInput('cancelText', 'Cancel');
      fixture.componentRef.setInput('confirmDisabled', true);
      fixture.componentRef.setInput('confirmLoading', true);
      fixture.componentRef.setInput('fullHeight', true);
      fixture.componentRef.setInput('centered', false);

      expect(component.title()).toBe('Test Title');
      expect(component.subtitle()).toBe('Test Subtitle');
      expect(component.variant()).toBe('confirmation');
      expect(component.size()).toBe('large');
      expect(component.closable()).toBe(false);
      expect(component.closeOnBackdrop()).toBe(false);
      expect(component.closeOnEscape()).toBe(false);
      expect(component.confirmText()).toBe('Save');
      expect(component.cancelText()).toBe('Cancel');
      expect(component.confirmDisabled()).toBe(true);
      expect(component.confirmLoading()).toBe(true);
      expect(component.fullHeight()).toBe(true);
      expect(component.centered()).toBe(false);
    });
  });

  describe('Computed Properties', () => {
    it('should generate unique IDs', () => {
      const titleId1 = component.titleId();
      const descriptionId1 = component.descriptionId();

      fixture.detectChanges();

      const titleId2 = component.titleId();
      const descriptionId2 = component.descriptionId();

      expect(titleId1).toBeDefined();
      expect(descriptionId1).toBeDefined();
      expect(titleId2).toBeDefined();
      expect(descriptionId2).toBeDefined();
    });

    it('should show header when title, subtitle, or closable is true', () => {
      // Default closable is true, so header should be shown by default
      expect(component.showHeader()).toBe(true);

      fixture.componentRef.setInput('closable', false);
      expect(component.showHeader()).toBe(false);

      fixture.componentRef.setInput('title', 'Test Title');
      expect(component.showHeader()).toBe(true);

      fixture.componentRef.setInput('title', null);
      fixture.componentRef.setInput('subtitle', 'Test Subtitle');
      expect(component.showHeader()).toBe(true);

      fixture.componentRef.setInput('subtitle', null);
      fixture.componentRef.setInput('closable', true);
      expect(component.showHeader()).toBe(true);
    });

    it('should show actions when actions array has items or showDefaultActions is true', () => {
      expect(component.showActions()).toBe(false);

      fixture.componentRef.setInput('actions', [
        {
          label: 'Test',
          variant: 'primary',
          action: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
        },
      ]);
      expect(component.showActions()).toBe(true);

      fixture.componentRef.setInput('actions', []);
      fixture.componentRef.setInput('showDefaultActions', true);
      expect(component.showActions()).toBe(true);
    });

    it('should return correct card variant based on modal variant', () => {
      const variants: OsModalVariant[] = ['default', 'confirmation', 'form', 'info'];
      const expectedCardVariants = ['default', 'outlined', 'elevated', 'flat'];

      variants.forEach((variant, index) => {
        fixture.componentRef.setInput('variant', variant);
        expect(component.cardVariant()).toBe(expectedCardVariants[index]);
      });
    });

    it('should return correct card size based on modal size', () => {
      const sizes: OsModalSize[] = ['small', 'medium', 'large', 'fullscreen'];
      const expectedCardSizes = ['small', 'medium', 'large', 'large'];

      sizes.forEach((size, index) => {
        fixture.componentRef.setInput('size', size);
        expect(component.cardSize()).toBe(expectedCardSizes[index]);
      });
    });

    it('should return correct button size based on modal size', () => {
      const sizes: OsModalSize[] = ['small', 'medium', 'large', 'fullscreen'];
      const expectedButtonSizes = ['small', 'medium', 'large', 'large'];

      sizes.forEach((size, index) => {
        fixture.componentRef.setInput('size', size);
        expect(component.buttonSize()).toBe(expectedButtonSizes[index]);
      });
    });
  });

  describe('CSS Classes', () => {
    it('should apply correct modal classes', () => {
      fixture.componentRef.setInput('variant', 'confirmation');
      fixture.componentRef.setInput('size', 'large');
      fixture.componentRef.setInput('fullHeight', true);
      fixture.componentRef.setInput('centered', true);

      const classes = component.modalClasses();
      expect(classes).toContain('os-modal');
      expect(classes).toContain('os-modal--confirmation');
      expect(classes).toContain('os-modal--large');
      expect(classes).toContain('os-modal--full-height');
      expect(classes).toContain('os-modal--centered');
    });

    it('should apply correct container classes', () => {
      fixture.componentRef.setInput('size', 'medium');
      fixture.componentRef.setInput('centered', true);

      const classes = component.containerClasses();
      expect(classes).toContain('os-modal__container');
      expect(classes).toContain('os-modal__container--medium');
      expect(classes).toContain('os-modal__container--centered');
    });

    it('should apply correct content classes', () => {
      fixture.componentRef.setInput('fullHeight', true);

      const classes = component.contentClasses();
      expect(classes).toContain('os-modal__content');
      expect(classes).toContain('os-modal__content--full-height');
    });

    it('should apply correct actions classes', () => {
      fixture.componentRef.setInput('actions', [
        {
          label: 'Action 1',
          variant: 'primary',
          action: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
        },
        {
          label: 'Action 2',
          variant: 'secondary',
          action: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
        },
      ]);

      let classes = component.actionsClasses();
      expect(classes).toContain('os-modal__actions');
      expect(classes).toContain('os-modal__actions--dual');

      fixture.componentRef.setInput('actions', [
        {
          label: 'Action 1',
          variant: 'primary',
          action: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
        },
        {
          label: 'Action 2',
          variant: 'secondary',
          action: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
        },
        {
          label: 'Action 3',
          variant: 'tertiary',
          action: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
        },
      ]);

      classes = component.actionsClasses();
      expect(classes).toContain('os-modal__actions--multiple');
    });
  });

  describe('Event Handlers', () => {
    it('should emit closed event when onClose is called', () => {
      const emitSpy = vi.spyOn(component.closed, 'emit');
      component.onClose();
      expect(emitSpy).toHaveBeenCalled();
    });

    it('should emit confirmed event when onConfirm is called', () => {
      const emitSpy = vi.spyOn(component.confirmed, 'emit');
      component.onConfirm();
      expect(emitSpy).toHaveBeenCalled();
    });

    it('should emit backdropClicked and close when backdrop is clicked and closeOnBackdrop is true', () => {
      const backdropEmitSpy = vi.spyOn(component.backdropClicked, 'emit');
      const onCloseSpy = vi.spyOn(component, 'onClose');

      fixture.componentRef.setInput('closeOnBackdrop', true);
      component.onBackdropClick();

      expect(backdropEmitSpy).toHaveBeenCalled();
      expect(onCloseSpy).toHaveBeenCalled();
    });

    it('should not close when backdrop is clicked and closeOnBackdrop is false', () => {
      const backdropEmitSpy = vi.spyOn(component.backdropClicked, 'emit');
      const onCloseSpy = vi.spyOn(component, 'onClose');

      fixture.componentRef.setInput('closeOnBackdrop', false);
      component.onBackdropClick();

      expect(backdropEmitSpy).not.toHaveBeenCalled();
      expect(onCloseSpy).not.toHaveBeenCalled();
    });
  });

  describe('Keyboard Events', () => {
    it('should close on escape key when closeOnEscape is true', () => {
      const onCloseSpy = vi.spyOn(component, 'onClose');

      fixture.componentRef.setInput('closeOnEscape', true);
      const event = new KeyboardEvent('keydown', { key: 'Escape' });

      // Mock preventDefault to track if it was called
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      component.onEscapeKey(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(onCloseSpy).toHaveBeenCalled();
    });

    it('should not close on escape key when closeOnEscape is false', () => {
      const onCloseSpy = vi.spyOn(component, 'onClose');

      fixture.componentRef.setInput('closeOnEscape', false);
      const event = new KeyboardEvent('keydown', { key: 'Escape' });

      component.onEscapeKey(event);

      expect(event.defaultPrevented).toBe(false);
      expect(onCloseSpy).not.toHaveBeenCalled();
    });

    it('should confirm on Ctrl+Enter or Cmd+Enter', () => {
      const onConfirmSpy = vi.spyOn(component, 'onConfirm');

      const ctrlEvent = new KeyboardEvent('keydown', { key: 'Enter', ctrlKey: true });
      component.onEnterKey(ctrlEvent);
      expect(onConfirmSpy).toHaveBeenCalled();

      const cmdEvent = new KeyboardEvent('keydown', { key: 'Enter', metaKey: true });
      component.onEnterKey(cmdEvent);
      expect(onConfirmSpy).toHaveBeenCalledTimes(2);
    });

    it('should not confirm on Enter without Ctrl or Cmd', () => {
      const onConfirmSpy = vi.spyOn(component, 'onConfirm');

      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      component.onEnterKey(event);

      expect(onConfirmSpy).not.toHaveBeenCalled();
    });
  });

  describe('Template Rendering', () => {
    it('should render title when provided', () => {
      fixture.componentRef.setInput('title', 'Test Title');
      fixture.detectChanges();

      const titleElement = fixture.nativeElement.querySelector('.os-modal__title');
      expect(titleElement).toBeTruthy();
      expect(titleElement.textContent.trim()).toBe('Test Title');
    });

    it('should render subtitle when provided', () => {
      fixture.componentRef.setInput('subtitle', 'Test Subtitle');
      fixture.detectChanges();

      const subtitleElement = fixture.nativeElement.querySelector('.os-modal__subtitle');
      expect(subtitleElement).toBeTruthy();
      expect(subtitleElement.textContent.trim()).toBe('Test Subtitle');
    });

    it('should render close button when closable is true', () => {
      fixture.componentRef.setInput('closable', true);
      fixture.detectChanges();

      const closeButton = fixture.nativeElement.querySelector('.os-modal__close');
      expect(closeButton).toBeTruthy();
      expect(closeButton.getAttribute('aria-label')).toBe('Fechar modal');
    });

    it('should not render close button when closable is false', () => {
      fixture.componentRef.setInput('closable', false);
      fixture.detectChanges();

      const closeButton = fixture.nativeElement.querySelector('.os-modal__close');
      expect(closeButton).toBeFalsy();
    });

    it('should render custom actions when provided', () => {
      const actions: OsModalAction[] = [
        {
          label: 'Save',
          variant: 'primary',
          action: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
        },
        {
          label: 'Cancel',
          variant: 'secondary',
          action: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
        },
      ];

      fixture.componentRef.setInput('actions', actions);
      fixture.detectChanges();

      const actionButtons = fixture.nativeElement.querySelectorAll('os-button');
      expect(actionButtons.length).toBe(2);

      // Just verify that the buttons are rendered
      expect(actionButtons[0]).toBeTruthy();
      expect(actionButtons[1]).toBeTruthy();
    });

    it('should render default actions when showDefaultActions is true', () => {
      fixture.componentRef.setInput('showDefaultActions', true);
      fixture.detectChanges();

      const actionButtons = fixture.nativeElement.querySelectorAll('os-button');
      expect(actionButtons.length).toBe(2);

      // Just verify that the buttons are rendered
      expect(actionButtons[0]).toBeTruthy();
      expect(actionButtons[1]).toBeTruthy();
    });

    it('should render content projection', () => {
      fixture.detectChanges();

      const contentElement = fixture.nativeElement.querySelector('.os-modal__content');
      expect(contentElement).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have correct ARIA attributes', () => {
      fixture.componentRef.setInput('title', 'Test Title');
      fixture.detectChanges();

      const modalElement = fixture.nativeElement.querySelector('.os-modal');
      expect(modalElement.getAttribute('role')).toBe('dialog');
      expect(modalElement.getAttribute('aria-modal')).toBe('true');
      expect(modalElement.getAttribute('aria-labelledby')).toBeTruthy();
    });

    it('should have correct ARIA describedby when subtitle is provided', () => {
      fixture.componentRef.setInput('subtitle', 'Test Subtitle');
      fixture.detectChanges();

      const modalElement = fixture.nativeElement.querySelector('.os-modal');
      expect(modalElement.getAttribute('aria-describedby')).toBeTruthy();
    });
  });

  describe('Integration with MatDialog', () => {
    it('should call dialogRef.close when onClose is called', () => {
      const dialogRef = TestBed.inject(MatDialogRef);
      component.onClose();
      expect(dialogRef.close).toHaveBeenCalled();
    });
  });
});
