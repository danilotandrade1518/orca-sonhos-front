import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { OsSpinnerComponent } from './os-spinner.component';

describe('OsSpinnerComponent', () => {
  let component: OsSpinnerComponent;
  let fixture: ComponentFixture<OsSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OsSpinnerComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(OsSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('size', () => {
    it('should apply medium size by default', () => {
      expect(component.size()).toBe('md');
      expect(component.spinnerClass()).toContain('os-spinner--md');
    });

    it('should apply xs size', () => {
      fixture.componentRef.setInput('size', 'xs');
      fixture.detectChanges();
      expect(component.spinnerClass()).toContain('os-spinner--xs');
    });

    it('should apply sm size', () => {
      fixture.componentRef.setInput('size', 'sm');
      fixture.detectChanges();
      expect(component.spinnerClass()).toContain('os-spinner--sm');
    });

    it('should apply lg size', () => {
      fixture.componentRef.setInput('size', 'lg');
      fixture.detectChanges();
      expect(component.spinnerClass()).toContain('os-spinner--lg');
    });

    it('should apply xl size', () => {
      fixture.componentRef.setInput('size', 'xl');
      fixture.detectChanges();
      expect(component.spinnerClass()).toContain('os-spinner--xl');
    });
  });

  describe('variant', () => {
    it('should apply default variant by default', () => {
      expect(component.variant()).toBe('default');
      expect(component.spinnerClass()).toContain('os-spinner--default');
    });

    it('should apply primary variant', () => {
      fixture.componentRef.setInput('variant', 'primary');
      fixture.detectChanges();
      expect(component.spinnerClass()).toContain('os-spinner--primary');
    });

    it('should apply secondary variant', () => {
      fixture.componentRef.setInput('variant', 'secondary');
      fixture.detectChanges();
      expect(component.spinnerClass()).toContain('os-spinner--secondary');
    });

    it('should apply success variant', () => {
      fixture.componentRef.setInput('variant', 'success');
      fixture.detectChanges();
      expect(component.spinnerClass()).toContain('os-spinner--success');
    });

    it('should apply warning variant', () => {
      fixture.componentRef.setInput('variant', 'warning');
      fixture.detectChanges();
      expect(component.spinnerClass()).toContain('os-spinner--warning');
    });

    it('should apply error variant', () => {
      fixture.componentRef.setInput('variant', 'error');
      fixture.detectChanges();
      expect(component.spinnerClass()).toContain('os-spinner--error');
    });

    it('should apply info variant', () => {
      fixture.componentRef.setInput('variant', 'info');
      fixture.detectChanges();
      expect(component.spinnerClass()).toContain('os-spinner--info');
    });
  });

  describe('accessibility', () => {
    it('should have default aria-label', () => {
      expect(component.ariaLabel()).toBe('Loading');
    });

    it('should have custom aria-label when provided', () => {
      fixture.componentRef.setInput('ariaLabel', 'Loading content');
      fixture.detectChanges();
      expect(component.ariaLabel()).toBe('Loading content');
    });

    it('should have aria-hidden false by default', () => {
      expect(component.ariaHidden()).toBe(false);
    });

    it('should have aria-hidden true when set', () => {
      fixture.componentRef.setInput('ariaHidden', true);
      fixture.detectChanges();
      expect(component.ariaHidden()).toBe(true);
    });
  });

  describe('spinner inner class', () => {
    it('should apply default inner class', () => {
      expect(component.spinnerInnerClass()).toBe('os-spinner__inner os-spinner__inner--md');
    });

    it('should apply size-specific inner class', () => {
      fixture.componentRef.setInput('size', 'lg');
      fixture.detectChanges();
      expect(component.spinnerInnerClass()).toBe('os-spinner__inner os-spinner__inner--lg');
    });
  });

  describe('component integration', () => {
    it('should handle multiple input changes', () => {
      fixture.componentRef.setInput('size', 'lg');
      fixture.componentRef.setInput('variant', 'primary');
      fixture.componentRef.setInput('ariaLabel', 'Loading data');
      fixture.componentRef.setInput('ariaHidden', true);
      fixture.detectChanges();

      expect(component.size()).toBe('lg');
      expect(component.variant()).toBe('primary');
      expect(component.ariaLabel()).toBe('Loading data');
      expect(component.ariaHidden()).toBe(true);
      expect(component.spinnerClass()).toContain('os-spinner--lg');
      expect(component.spinnerClass()).toContain('os-spinner--primary');
    });

    it('should maintain state consistency', () => {
      expect(component.size()).toBe('md');
      expect(component.variant()).toBe('default');
      expect(component.ariaLabel()).toBe('Loading');
      expect(component.ariaHidden()).toBe(false);
    });
  });
});
