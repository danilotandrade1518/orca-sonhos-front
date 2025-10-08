import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OsProgressBarComponent } from './os-progress-bar.component';
import { provideZonelessChangeDetection } from '@angular/core';

describe('OsProgressBarComponent', () => {
  let component: OsProgressBarComponent;
  let fixture: ComponentFixture<OsProgressBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OsProgressBarComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(OsProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('rendering', () => {
    it('should render with default values', () => {
      expect(component.value()).toBe(0);
      expect(component.max()).toBe(100);
      expect(component.size()).toBe('medium');
      expect(component.variant()).toBe('primary');
      expect(component.showPercentage()).toBe(true);
    });

    it('should render with custom label', () => {
      fixture.componentRef.setInput('label', 'Loading...');
      fixture.detectChanges();

      const labelElement = fixture.nativeElement.querySelector('.os-progress-bar__text');
      expect(labelElement.textContent.trim()).toBe('Loading...');
    });

    it('should render with custom hint', () => {
      fixture.componentRef.setInput('hint', 'Please wait');
      fixture.detectChanges();

      const hintElement = fixture.nativeElement.querySelector('.os-progress-bar__hint');
      expect(hintElement.textContent.trim()).toBe('Please wait');
    });

    it('should render with custom size', () => {
      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();

      const progressBarElement = fixture.nativeElement.querySelector('.os-progress-bar');
      expect(progressBarElement.classList.contains('os-progress-bar--large')).toBe(true);
    });

    it('should render with custom variant', () => {
      fixture.componentRef.setInput('variant', 'success');
      fixture.detectChanges();

      const progressBarElement = fixture.nativeElement.querySelector('.os-progress-bar');
      expect(progressBarElement.classList.contains('os-progress-bar--success')).toBe(true);
    });
  });

  describe('percentage calculation', () => {
    it('should calculate percentage correctly', () => {
      fixture.componentRef.setInput('value', 50);
      fixture.componentRef.setInput('max', 100);
      fixture.detectChanges();

      expect(component.percentage()).toBe(50);
    });

    it('should handle zero value', () => {
      fixture.componentRef.setInput('value', 0);
      fixture.componentRef.setInput('max', 100);
      fixture.detectChanges();

      expect(component.percentage()).toBe(0);
    });

    it('should handle maximum value', () => {
      fixture.componentRef.setInput('value', 100);
      fixture.componentRef.setInput('max', 100);
      fixture.detectChanges();

      expect(component.percentage()).toBe(100);
    });

    it('should handle values exceeding maximum', () => {
      fixture.componentRef.setInput('value', 150);
      fixture.componentRef.setInput('max', 100);
      fixture.detectChanges();

      expect(component.percentage()).toBe(100);
    });

    it('should handle negative values', () => {
      fixture.componentRef.setInput('value', -10);
      fixture.componentRef.setInput('max', 100);
      fixture.detectChanges();

      expect(component.percentage()).toBe(0);
    });
  });

  describe('percentage display', () => {
    it('should show percentage when showPercentage is true', () => {
      fixture.componentRef.setInput('value', 75);
      fixture.componentRef.setInput('label', 'Test Label');
      fixture.componentRef.setInput('showPercentage', true);
      fixture.detectChanges();

      const percentageElement = fixture.nativeElement.querySelector('.os-progress-bar__percentage');
      expect(percentageElement.textContent.trim()).toBe('75%');
    });

    it('should hide percentage when showPercentage is false', () => {
      fixture.componentRef.setInput('showPercentage', false);
      fixture.detectChanges();

      const percentageElement = fixture.nativeElement.querySelector('.os-progress-bar__percentage');
      expect(percentageElement).toBeFalsy();
    });
  });

  describe('progress bar fill', () => {
    it('should set correct width based on percentage', () => {
      fixture.componentRef.setInput('value', 60);
      fixture.detectChanges();

      const fillElement = fixture.nativeElement.querySelector('.os-progress-bar__fill');
      expect(fillElement.style.width).toBe('60%');
    });

    it('should apply correct classes for animated state', () => {
      fixture.componentRef.setInput('animated', true);
      fixture.detectChanges();

      const progressBarElement = fixture.nativeElement.querySelector('.os-progress-bar');
      expect(progressBarElement.classList.contains('os-progress-bar--animated')).toBe(true);
    });

    it('should apply correct classes for striped state', () => {
      fixture.componentRef.setInput('striped', true);
      fixture.detectChanges();

      const progressBarElement = fixture.nativeElement.querySelector('.os-progress-bar');
      expect(progressBarElement.classList.contains('os-progress-bar--striped')).toBe(true);
    });
  });

  describe('CSS classes', () => {
    it('should apply correct size class', () => {
      fixture.componentRef.setInput('size', 'small');
      fixture.detectChanges();

      const progressBarElement = fixture.nativeElement.querySelector('.os-progress-bar');
      expect(progressBarElement.classList.contains('os-progress-bar--small')).toBe(true);
    });

    it('should apply correct variant class', () => {
      fixture.componentRef.setInput('variant', 'danger');
      fixture.detectChanges();

      const progressBarElement = fixture.nativeElement.querySelector('.os-progress-bar');
      expect(progressBarElement.classList.contains('os-progress-bar--danger')).toBe(true);
    });
  });
});
