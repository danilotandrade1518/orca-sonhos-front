import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { OsButtonComponent } from './os-button.component';

describe('OsButtonComponent', () => {
  let component: OsButtonComponent;
  let fixture: ComponentFixture<OsButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OsButtonComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(OsButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('variant', () => {
    it('should apply primary variant by default', () => {
      expect(component.variant()).toBe('primary');
      expect(component.buttonClass()).toContain('os-button--primary');
    });

    it('should apply secondary variant', () => {
      fixture.componentRef.setInput('variant', 'secondary');
      fixture.detectChanges();
      expect(component.buttonClass()).toContain('os-button--secondary');
    });

    it('should apply tertiary variant', () => {
      fixture.componentRef.setInput('variant', 'tertiary');
      fixture.detectChanges();
      expect(component.buttonClass()).toContain('os-button--tertiary');
    });

    it('should apply danger variant', () => {
      fixture.componentRef.setInput('variant', 'danger');
      fixture.detectChanges();
      expect(component.buttonClass()).toContain('os-button--danger');
    });
  });

  describe('size', () => {
    it('should apply medium size by default', () => {
      expect(component.size()).toBe('medium');
      expect(component.buttonClass()).toContain('os-button--medium');
    });

    it('should apply small size', () => {
      fixture.componentRef.setInput('size', 'small');
      fixture.detectChanges();
      expect(component.buttonClass()).toContain('os-button--small');
    });

    it('should apply large size', () => {
      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();
      expect(component.buttonClass()).toContain('os-button--large');
    });
  });

  describe('disabled state', () => {
    it('should not be disabled by default', () => {
      expect(component.disabled()).toBe(false);
      expect(component.buttonClass()).not.toContain('os-button--disabled');
    });

    it('should apply disabled class when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      expect(component.buttonClass()).toContain('os-button--disabled');
    });

    it('should not emit click when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      let clickEmitted = false;
      component.buttonClick.subscribe(() => (clickEmitted = true));

      component.handleClick(new MouseEvent('click'));

      expect(clickEmitted).toBe(false);
    });

    it('should have disabled attribute on button element when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const buttonElement = fixture.nativeElement.querySelector('button');
      expect(buttonElement.disabled).toBe(true);
    });
  });

  describe('loading state', () => {
    it('should not be loading by default', () => {
      expect(component.loading()).toBe(false);
      expect(component.buttonClass()).not.toContain('os-button--loading');
    });

    it('should apply loading class when loading', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();
      expect(component.buttonClass()).toContain('os-button--loading');
    });

    it('should not emit click when loading', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      let clickEmitted = false;
      component.buttonClick.subscribe(() => (clickEmitted = true));

      component.handleClick(new MouseEvent('click'));

      expect(clickEmitted).toBe(false);
    });

    it('should show spinner when loading', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      const spinnerElement = fixture.nativeElement.querySelector('.os-button__spinner');
      expect(spinnerElement).toBeTruthy();
    });

    it('should not show icon when loading', () => {
      fixture.componentRef.setInput('icon', '★');
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      const iconElement = fixture.nativeElement.querySelector('.os-button__icon');
      expect(iconElement).toBeFalsy();
    });
  });

  describe('click handling', () => {
    it('should have buttonClick output defined', () => {
      expect(component.buttonClick).toBeDefined();
    });

    it('should emit click event when clicked', () => {
      let clickEmitted = false;
      let emittedEvent: MouseEvent | undefined;

      component.buttonClick.subscribe((event) => {
        clickEmitted = true;
        emittedEvent = event;
      });

      const mockEvent = new MouseEvent('click');
      component.handleClick(mockEvent);

      expect(clickEmitted).toBe(true);
      expect(emittedEvent).toBe(mockEvent);
    });

    it('should not emit click when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      let clickEmitted = false;
      component.buttonClick.subscribe(() => (clickEmitted = true));

      component.handleClick(new MouseEvent('click'));

      expect(clickEmitted).toBe(false);
    });

    it('should not emit click when loading', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      let clickEmitted = false;
      component.buttonClick.subscribe(() => (clickEmitted = true));

      component.handleClick(new MouseEvent('click'));

      expect(clickEmitted).toBe(false);
    });

    it('should emit click when both disabled and loading are false', () => {
      fixture.componentRef.setInput('disabled', false);
      fixture.componentRef.setInput('loading', false);
      fixture.detectChanges();

      let clickEmitted = false;
      component.buttonClick.subscribe(() => (clickEmitted = true));

      component.handleClick(new MouseEvent('click'));

      expect(clickEmitted).toBe(true);
    });
  });

  describe('icon', () => {
    it('should not show icon by default', () => {
      expect(component.icon()).toBe('');
    });

    it('should show icon when provided', () => {
      fixture.componentRef.setInput('icon', 'home');
      fixture.detectChanges();

      const iconElement = fixture.nativeElement.querySelector('mat-icon');
      expect(iconElement).toBeTruthy();
      expect(iconElement.getAttribute('fontIcon')).toBe('home');
    });

    it('should not show icon when loading', () => {
      fixture.componentRef.setInput('icon', '★');
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      const iconElement = fixture.nativeElement.querySelector('.os-button__icon');
      expect(iconElement).toBeFalsy();
    });
  });

  describe('type', () => {
    it('should have button type by default', () => {
      expect(component.type()).toBe('button');
    });

    it('should apply submit type', () => {
      fixture.componentRef.setInput('type', 'submit');
      fixture.detectChanges();

      const buttonElement = fixture.nativeElement.querySelector('button');
      expect(buttonElement.type).toBe('submit');
    });

    it('should apply reset type', () => {
      fixture.componentRef.setInput('type', 'reset');
      fixture.detectChanges();

      const buttonElement = fixture.nativeElement.querySelector('button');
      expect(buttonElement.type).toBe('reset');
    });
  });

  describe('accessibility', () => {
    it('should have proper ARIA attributes', () => {
      const buttonElement = fixture.nativeElement.querySelector('button');
      expect(buttonElement).toBeTruthy();
    });

    it('should be focusable when not disabled', () => {
      const buttonElement = fixture.nativeElement.querySelector('button');
      expect(buttonElement.tabIndex).toBe(0);
    });

    it('should not be focusable when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const buttonElement = fixture.nativeElement.querySelector('button');
      expect(buttonElement.disabled).toBe(true);
    });

    it('should have proper button type attribute', () => {
      const buttonElement = fixture.nativeElement.querySelector('button');
      expect(buttonElement.type).toBe('button');
    });

    it('should have proper button type when set to submit', () => {
      fixture.componentRef.setInput('type', 'submit');
      fixture.detectChanges();

      const buttonElement = fixture.nativeElement.querySelector('button');
      expect(buttonElement.type).toBe('submit');
    });

    it('should have proper button type when set to reset', () => {
      fixture.componentRef.setInput('type', 'reset');
      fixture.detectChanges();

      const buttonElement = fixture.nativeElement.querySelector('button');
      expect(buttonElement.type).toBe('reset');
    });
  });

  describe('template rendering', () => {
    it('should render button element', () => {
      const buttonElement = fixture.nativeElement.querySelector('button');
      expect(buttonElement).toBeTruthy();
    });

    it('should render content projection', () => {
      fixture.componentRef.setInput('icon', '');
      fixture.detectChanges();

      const contentElement = fixture.nativeElement.querySelector('.os-button__content');
      expect(contentElement).toBeTruthy();
    });

    it('should apply correct CSS classes', () => {
      fixture.detectChanges();

      const buttonElement = fixture.nativeElement.querySelector('button');
      expect(buttonElement.classList.contains('os-button')).toBe(true);
      expect(buttonElement.classList.contains('os-button--primary')).toBe(true);
      expect(buttonElement.classList.contains('os-button--medium')).toBe(true);
    });

    it('should update classes when inputs change', () => {
      fixture.componentRef.setInput('variant', 'secondary');
      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();

      const buttonElement = fixture.nativeElement.querySelector('button');
      expect(buttonElement.classList.contains('os-button--secondary')).toBe(true);
      expect(buttonElement.classList.contains('os-button--large')).toBe(true);
    });
  });

  describe('component integration', () => {
    it('should handle multiple input changes', () => {
      fixture.componentRef.setInput('variant', 'danger');
      fixture.componentRef.setInput('size', 'small');
      fixture.componentRef.setInput('disabled', true);
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      const buttonClass = component.buttonClass();
      expect(buttonClass).toContain('os-button--danger');
      expect(buttonClass).toContain('os-button--small');
      expect(buttonClass).toContain('os-button--disabled');
      expect(buttonClass).toContain('os-button--loading');
    });

    it('should maintain state consistency', () => {
      expect(component.variant()).toBe('primary');
      expect(component.size()).toBe('medium');
      expect(component.disabled()).toBe(false);
      expect(component.loading()).toBe(false);
      expect(component.icon()).toBe('');
      expect(component.type()).toBe('button');
    });
  });
});
