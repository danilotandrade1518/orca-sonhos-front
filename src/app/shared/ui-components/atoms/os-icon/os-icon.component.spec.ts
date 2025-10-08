import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { OsIconComponent } from './os-icon.component';

describe('OsIconComponent', () => {
  let component: OsIconComponent;
  let fixture: ComponentFixture<OsIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OsIconComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(OsIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('name', () => {
    it('should have empty name by default', () => {
      expect(component.name()).toBe('');
    });

    it('should display icon content when name provided', () => {
      fixture.componentRef.setInput('name', 'home');
      fixture.detectChanges();
      expect(component.iconContent()).toBe('🏠');
    });

    it('should display custom icon when name not in map', () => {
      fixture.componentRef.setInput('name', 'custom-icon');
      fixture.detectChanges();
      expect(component.iconContent()).toBe('custom-icon');
    });
  });

  describe('size', () => {
    it('should apply medium size by default', () => {
      expect(component.size()).toBe('md');
      expect(component.iconClass()).toContain('os-icon--md');
    });

    it('should apply xs size', () => {
      fixture.componentRef.setInput('size', 'xs');
      fixture.detectChanges();
      expect(component.iconClass()).toContain('os-icon--xs');
    });

    it('should apply sm size', () => {
      fixture.componentRef.setInput('size', 'sm');
      fixture.detectChanges();
      expect(component.iconClass()).toContain('os-icon--sm');
    });

    it('should apply lg size', () => {
      fixture.componentRef.setInput('size', 'lg');
      fixture.detectChanges();
      expect(component.iconClass()).toContain('os-icon--lg');
    });

    it('should apply xl size', () => {
      fixture.componentRef.setInput('size', 'xl');
      fixture.detectChanges();
      expect(component.iconClass()).toContain('os-icon--xl');
    });

    it('should apply 2xl size', () => {
      fixture.componentRef.setInput('size', '2xl');
      fixture.detectChanges();
      expect(component.iconClass()).toContain('os-icon--2xl');
    });
  });

  describe('variant', () => {
    it('should apply default variant by default', () => {
      expect(component.variant()).toBe('default');
      expect(component.iconClass()).toContain('os-icon--default');
    });

    it('should apply primary variant', () => {
      fixture.componentRef.setInput('variant', 'primary');
      fixture.detectChanges();
      expect(component.iconClass()).toContain('os-icon--primary');
    });

    it('should apply secondary variant', () => {
      fixture.componentRef.setInput('variant', 'secondary');
      fixture.detectChanges();
      expect(component.iconClass()).toContain('os-icon--secondary');
    });

    it('should apply success variant', () => {
      fixture.componentRef.setInput('variant', 'success');
      fixture.detectChanges();
      expect(component.iconClass()).toContain('os-icon--success');
    });

    it('should apply warning variant', () => {
      fixture.componentRef.setInput('variant', 'warning');
      fixture.detectChanges();
      expect(component.iconClass()).toContain('os-icon--warning');
    });

    it('should apply error variant', () => {
      fixture.componentRef.setInput('variant', 'error');
      fixture.detectChanges();
      expect(component.iconClass()).toContain('os-icon--error');
    });

    it('should apply info variant', () => {
      fixture.componentRef.setInput('variant', 'info');
      fixture.detectChanges();
      expect(component.iconClass()).toContain('os-icon--info');
    });
  });

  describe('accessibility', () => {
    it('should have aria-hidden true by default', () => {
      expect(component.ariaHidden()).toBe(true);
    });

    it('should have aria-hidden false when set', () => {
      fixture.componentRef.setInput('ariaHidden', false);
      fixture.detectChanges();
      expect(component.ariaHidden()).toBe(false);
    });

    it('should have empty aria-label by default', () => {
      expect(component.ariaLabel()).toBe('');
    });

    it('should have aria-label when provided', () => {
      fixture.componentRef.setInput('ariaLabel', 'Home icon');
      fixture.detectChanges();
      expect(component.ariaLabel()).toBe('Home icon');
    });

    it('should have empty title by default', () => {
      expect(component.title()).toBe('');
    });

    it('should have title when provided', () => {
      fixture.componentRef.setInput('title', 'Go to home');
      fixture.detectChanges();
      expect(component.title()).toBe('Go to home');
    });
  });

  describe('animations', () => {
    it('should not spin by default', () => {
      expect(component.spin()).toBe(false);
      expect(component.iconClass()).not.toContain('os-icon--spin');
    });

    it('should spin when set', () => {
      fixture.componentRef.setInput('spin', true);
      fixture.detectChanges();
      expect(component.spin()).toBe(true);
      expect(component.iconClass()).toContain('os-icon--spin');
    });

    it('should not pulse by default', () => {
      expect(component.pulse()).toBe(false);
      expect(component.iconClass()).not.toContain('os-icon--pulse');
    });

    it('should pulse when set', () => {
      fixture.componentRef.setInput('pulse', true);
      fixture.detectChanges();
      expect(component.pulse()).toBe(true);
      expect(component.iconClass()).toContain('os-icon--pulse');
    });
  });

  describe('icon mapping', () => {
    it('should map home icon correctly', () => {
      fixture.componentRef.setInput('name', 'home');
      fixture.detectChanges();
      expect(component.iconContent()).toBe('🏠');
    });

    it('should map search icon correctly', () => {
      fixture.componentRef.setInput('name', 'search');
      fixture.detectChanges();
      expect(component.iconContent()).toBe('🔍');
    });

    it('should map user icon correctly', () => {
      fixture.componentRef.setInput('name', 'user');
      fixture.detectChanges();
      expect(component.iconContent()).toBe('👤');
    });

    it('should map money icon correctly', () => {
      fixture.componentRef.setInput('name', 'money');
      fixture.detectChanges();
      expect(component.iconContent()).toBe('💰');
    });

    it('should map settings icon correctly', () => {
      fixture.componentRef.setInput('name', 'settings');
      fixture.detectChanges();
      expect(component.iconContent()).toBe('⚙');
    });

    it('should map check icon correctly', () => {
      fixture.componentRef.setInput('name', 'check');
      fixture.detectChanges();
      expect(component.iconContent()).toBe('✓');
    });

    it('should map close icon correctly', () => {
      fixture.componentRef.setInput('name', 'close');
      fixture.detectChanges();
      expect(component.iconContent()).toBe('✕');
    });

    it('should map loading icon correctly', () => {
      fixture.componentRef.setInput('name', 'loading');
      fixture.detectChanges();
      expect(component.iconContent()).toBe('⟳');
    });
  });

  describe('component integration', () => {
    it('should handle multiple input changes', () => {
      fixture.componentRef.setInput('name', 'home');
      fixture.componentRef.setInput('size', 'lg');
      fixture.componentRef.setInput('variant', 'primary');
      fixture.componentRef.setInput('spin', true);
      fixture.componentRef.setInput('ariaLabel', 'Home icon');
      fixture.detectChanges();

      expect(component.name()).toBe('home');
      expect(component.size()).toBe('lg');
      expect(component.variant()).toBe('primary');
      expect(component.spin()).toBe(true);
      expect(component.ariaLabel()).toBe('Home icon');
      expect(component.iconClass()).toContain('os-icon--lg');
      expect(component.iconClass()).toContain('os-icon--primary');
      expect(component.iconClass()).toContain('os-icon--spin');
    });

    it('should maintain state consistency', () => {
      expect(component.name()).toBe('');
      expect(component.size()).toBe('md');
      expect(component.variant()).toBe('default');
      expect(component.ariaHidden()).toBe(true);
      expect(component.ariaLabel()).toBe('');
      expect(component.title()).toBe('');
      expect(component.spin()).toBe(false);
      expect(component.pulse()).toBe(false);
    });
  });
});
