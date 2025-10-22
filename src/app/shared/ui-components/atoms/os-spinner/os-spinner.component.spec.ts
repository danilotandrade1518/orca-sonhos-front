import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OsSpinnerComponent } from './os-spinner.component';

describe('OsSpinnerComponent', () => {
  let component: OsSpinnerComponent;
  let fixture: ComponentFixture<OsSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OsSpinnerComponent, MatProgressSpinnerModule],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(OsSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('default values', () => {
    it('should have default values', () => {
      expect(component.size()).toBe('md');
      expect(component.variant()).toBe('default');
      expect(component.type()).toBe('default');
      expect(component.role()).toBe('status');
      expect(component.ariaLabel()).toBe('Loading');
      expect(component.ariaHidden()).toBe(false);
      expect(component.animated()).toBe(true);
      expect(component.fadeIn()).toBe(true);
      expect(component.fadeOut()).toBe(true);
    });
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

  describe('new functionality', () => {
    describe('type', () => {
      it('should apply default type by default', () => {
        expect(component.type()).toBe('default');
        expect(component.spinnerWrapperClass()).toContain('os-spinner-wrapper--default');
      });

      it('should apply overlay type', () => {
        fixture.componentRef.setInput('type', 'overlay');
        fixture.detectChanges();
        expect(component.type()).toBe('overlay');
        expect(component.spinnerWrapperClass()).toContain('os-spinner-wrapper--overlay');
      });
    });

    describe('role', () => {
      it('should apply status role by default', () => {
        expect(component.role()).toBe('status');
        expect(component.spinnerRole()).toBe('status');
      });

      it('should apply progressbar role', () => {
        fixture.componentRef.setInput('role', 'progressbar');
        fixture.detectChanges();
        expect(component.role()).toBe('progressbar');
        expect(component.spinnerRole()).toBe('progressbar');
      });

      it('should apply presentation role', () => {
        fixture.componentRef.setInput('role', 'presentation');
        fixture.detectChanges();
        expect(component.role()).toBe('presentation');
        expect(component.spinnerRole()).toBe('presentation');
      });
    });

    describe('aria-live', () => {
      it('should have aria-live polite for status role', () => {
        expect(component.ariaLive()).toBe('polite');
      });

      it('should not have aria-live for non-status roles', () => {
        fixture.componentRef.setInput('role', 'progressbar');
        fixture.detectChanges();
        expect(component.ariaLive()).toBeNull();
      });
    });

    describe('animations', () => {
      it('should apply animated class when animated is true', () => {
        expect(component.animated()).toBe(true);
        expect(component.spinnerClass()).toContain('os-spinner--animated');
        expect(component.spinnerWrapperClass()).toContain('os-spinner-wrapper--animated');
      });

      it('should not apply animated class when animated is false', () => {
        fixture.componentRef.setInput('animated', false);
        fixture.detectChanges();
        expect(component.spinnerClass()).not.toContain('os-spinner--animated');
        expect(component.spinnerWrapperClass()).not.toContain('os-spinner-wrapper--animated');
      });

      it('should apply fade-in class when fadeIn is true', () => {
        expect(component.fadeIn()).toBe(true);
        expect(component.spinnerWrapperClass()).toContain('os-spinner-wrapper--fade-in');
      });

      it('should apply fade-out class when fadeOut is true', () => {
        expect(component.fadeOut()).toBe(true);
        expect(component.spinnerWrapperClass()).toContain('os-spinner-wrapper--fade-out');
      });
    });

    describe('wrapper class', () => {
      it('should generate correct wrapper class', () => {
        const expectedClass =
          'os-spinner-wrapper os-spinner-wrapper--default os-spinner-wrapper--md os-spinner-wrapper--animated os-spinner-wrapper--fade-in os-spinner-wrapper--fade-out';
        expect(component.spinnerWrapperClass()).toBe(expectedClass);
      });

      it('should generate correct wrapper class for overlay type', () => {
        fixture.componentRef.setInput('type', 'overlay');
        fixture.detectChanges();
        const expectedClass =
          'os-spinner-wrapper os-spinner-wrapper--overlay os-spinner-wrapper--md os-spinner-wrapper--animated os-spinner-wrapper--fade-in os-spinner-wrapper--fade-out';
        expect(component.spinnerWrapperClass()).toBe(expectedClass);
      });
    });
  });

  describe('accessibility enhancements', () => {
    it('should have proper ARIA attributes', () => {
      const compiled = fixture.nativeElement;
      const wrapper = compiled.querySelector('.os-spinner-wrapper');
      const spinner = compiled.querySelector('mat-spinner');

      expect(wrapper.getAttribute('aria-live')).toBe('polite');
      expect(wrapper.getAttribute('aria-label')).toBe('Loading');
      expect(wrapper.getAttribute('role')).toBe('status');
      expect(spinner.getAttribute('aria-label')).toBe('Loading');
      expect(spinner.getAttribute('aria-hidden')).toBe('false');
    });

    it('should handle custom aria-label', () => {
      fixture.componentRef.setInput('ariaLabel', 'Loading data');
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const wrapper = compiled.querySelector('.os-spinner-wrapper');
      const spinner = compiled.querySelector('mat-spinner');

      expect(wrapper.getAttribute('aria-label')).toBe('Loading data');
      expect(spinner.getAttribute('aria-label')).toBe('Loading data');
    });

    it('should handle aria-hidden true', () => {
      fixture.componentRef.setInput('ariaHidden', true);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const spinner = compiled.querySelector('mat-spinner');

      expect(spinner.getAttribute('aria-hidden')).toBe('true');
    });
  });

  describe('Material mapping', () => {
    it('should map sizes to Material diameter', () => {
      fixture.componentRef.setInput('size', 'xs');
      fixture.detectChanges();
      expect(component['matDiameter']()).toBe(16);

      fixture.componentRef.setInput('size', 'sm');
      fixture.detectChanges();
      expect(component['matDiameter']()).toBe(20);

      fixture.componentRef.setInput('size', 'md');
      fixture.detectChanges();
      expect(component['matDiameter']()).toBe(24);

      fixture.componentRef.setInput('size', 'lg');
      fixture.detectChanges();
      expect(component['matDiameter']()).toBe(32);

      fixture.componentRef.setInput('size', 'xl');
      fixture.detectChanges();
      expect(component['matDiameter']()).toBe(40);
    });

    it('should map variants to Material colors', () => {
      fixture.componentRef.setInput('variant', 'primary');
      fixture.detectChanges();
      expect(component['matColor']()).toBe('primary');

      fixture.componentRef.setInput('variant', 'secondary');
      fixture.detectChanges();
      expect(component['matColor']()).toBe('accent');

      fixture.componentRef.setInput('variant', 'error');
      fixture.detectChanges();
      expect(component['matColor']()).toBe('warn');

      fixture.componentRef.setInput('variant', 'default');
      fixture.detectChanges();
      expect(component['matColor']()).toBeUndefined();
    });
  });

  describe('integration tests', () => {
    it('should handle all inputs together', () => {
      fixture.componentRef.setInput('size', 'lg');
      fixture.componentRef.setInput('variant', 'success');
      fixture.componentRef.setInput('type', 'overlay');
      fixture.componentRef.setInput('role', 'progressbar');
      fixture.componentRef.setInput('ariaLabel', 'Loading content');
      fixture.componentRef.setInput('ariaHidden', true);
      fixture.componentRef.setInput('animated', false);
      fixture.componentRef.setInput('fadeIn', false);
      fixture.componentRef.setInput('fadeOut', false);
      fixture.detectChanges();

      expect(component.size()).toBe('lg');
      expect(component.variant()).toBe('success');
      expect(component.type()).toBe('overlay');
      expect(component.role()).toBe('progressbar');
      expect(component.ariaLabel()).toBe('Loading content');
      expect(component.ariaHidden()).toBe(true);
      expect(component.animated()).toBe(false);
      expect(component.fadeIn()).toBe(false);
      expect(component.fadeOut()).toBe(false);
      expect(component.spinnerClass()).toContain('os-spinner--lg');
      expect(component.spinnerClass()).toContain('os-spinner--success');
      expect(component.spinnerWrapperClass()).toContain('os-spinner-wrapper--overlay');
    });
  });
});
