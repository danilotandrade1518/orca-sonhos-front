import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ChartContainerComponent } from './chart-container.component';

describe('ChartContainerComponent', () => {
  let component: ChartContainerComponent;
  let fixture: ComponentFixture<ChartContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartContainerComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(ChartContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('default properties', () => {
    it('should have empty title by default', () => {
      expect(component.title()).toBe('');
    });

    it('should have empty subtitle by default', () => {
      expect(component.subtitle()).toBe('');
    });

    it('should have loading false by default', () => {
      expect(component.loading()).toBe(false);
    });

    it('should have error null by default', () => {
      expect(component.error()).toBeNull();
    });

    it('should have empty false by default', () => {
      expect(component.empty()).toBe(false);
    });

    it('should have default empty text', () => {
      expect(component.emptyText()).toBe('Nenhum dado disponível para o período selecionado');
    });

    it('should have default loading text', () => {
      expect(component.loadingText()).toBe('Carregando gráfico...');
    });

    it('should have retryable false by default', () => {
      expect(component.retryable()).toBe(false);
    });

    it('should have empty action text empty by default', () => {
      expect(component.emptyActionText()).toBe('');
    });

    it('should have default variant', () => {
      expect(component.variant()).toBe('default');
    });

    it('should have ariaLabel null by default', () => {
      expect(component.ariaLabel()).toBeNull();
    });
  });

  describe('titleId computed', () => {
    it('should return null when title is empty', () => {
      fixture.componentRef.setInput('title', '');
      fixture.detectChanges();

      expect(component.titleId()).toBeNull();
    });

    it('should return id when title exists', () => {
      fixture.componentRef.setInput('title', 'Test Title');
      fixture.detectChanges();

      const titleId = component.titleId();
      expect(titleId).toBeTruthy();
      expect(titleId).toContain('chart-container-');
      expect(titleId).toContain('-title');
    });
  });

  describe('ariaLive computed', () => {
    it('should return polite when loading', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      expect(component.ariaLive()).toBe('polite');
    });

    it('should return assertive when error', () => {
      fixture.componentRef.setInput('error', 'Error message');
      fixture.detectChanges();

      expect(component.ariaLive()).toBe('assertive');
    });

    it('should return null when not loading or error', () => {
      fixture.componentRef.setInput('loading', false);
      fixture.componentRef.setInput('error', null);
      fixture.detectChanges();

      expect(component.ariaLive()).toBeNull();
    });
  });

  describe('containerClasses computed', () => {
    it('should include base class', () => {
      const classes = component.containerClasses();
      expect(classes).toContain('os-chart-container');
    });

    it('should include variant class when not default', () => {
      fixture.componentRef.setInput('variant', 'compact');
      fixture.detectChanges();

      const classes = component.containerClasses();
      expect(classes).toContain('os-chart-container--compact');
    });

    it('should include loading class when loading', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      const classes = component.containerClasses();
      expect(classes).toContain('os-chart-container--loading');
    });

    it('should include error class when error', () => {
      fixture.componentRef.setInput('error', 'Error message');
      fixture.detectChanges();

      const classes = component.containerClasses();
      expect(classes).toContain('os-chart-container--error');
    });

    it('should include empty class when empty', () => {
      fixture.componentRef.setInput('empty', true);
      fixture.detectChanges();

      const classes = component.containerClasses();
      expect(classes).toContain('os-chart-container--empty');
    });

    it('should combine multiple classes', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.componentRef.setInput('variant', 'compact');
      fixture.detectChanges();

      const classes = component.containerClasses();
      expect(classes).toContain('os-chart-container');
      expect(classes).toContain('os-chart-container--compact');
      expect(classes).toContain('os-chart-container--loading');
    });
  });

  describe('onRetry', () => {
    it('should emit retry event', () => {
      
      const retrySpy = vi.fn();
      component.retry.subscribe(retrySpy);
      
      component.onRetry();
      
      expect(retrySpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('onEmptyAction', () => {
    it('should emit emptyAction event', () => {
      
      const emptyActionSpy = vi.fn();
      component.emptyAction.subscribe(emptyActionSpy);
      
      component.onEmptyAction();
      
      expect(emptyActionSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('inputs', () => {
    it('should accept title input', () => {
      fixture.componentRef.setInput('title', 'Custom Title');
      fixture.detectChanges();

      expect(component.title()).toBe('Custom Title');
    });

    it('should accept subtitle input', () => {
      fixture.componentRef.setInput('subtitle', 'Custom Subtitle');
      fixture.detectChanges();

      expect(component.subtitle()).toBe('Custom Subtitle');
    });

    it('should accept loading input', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      expect(component.loading()).toBe(true);
    });

    it('should accept error input', () => {
      fixture.componentRef.setInput('error', 'Error message');
      fixture.detectChanges();

      expect(component.error()).toBe('Error message');
    });

    it('should accept empty input', () => {
      fixture.componentRef.setInput('empty', true);
      fixture.detectChanges();

      expect(component.empty()).toBe(true);
    });

    it('should accept emptyText input', () => {
      fixture.componentRef.setInput('emptyText', 'Custom empty text');
      fixture.detectChanges();

      expect(component.emptyText()).toBe('Custom empty text');
    });

    it('should accept loadingText input', () => {
      fixture.componentRef.setInput('loadingText', 'Custom loading text');
      fixture.detectChanges();

      expect(component.loadingText()).toBe('Custom loading text');
    });

    it('should accept retryable input', () => {
      fixture.componentRef.setInput('retryable', true);
      fixture.detectChanges();

      expect(component.retryable()).toBe(true);
    });

    it('should accept emptyActionText input', () => {
      fixture.componentRef.setInput('emptyActionText', 'Custom action');
      fixture.detectChanges();

      expect(component.emptyActionText()).toBe('Custom action');
    });

    it('should accept variant input', () => {
      fixture.componentRef.setInput('variant', 'compact');
      fixture.detectChanges();

      expect(component.variant()).toBe('compact');
    });

    it('should accept ariaLabel input', () => {
      fixture.componentRef.setInput('ariaLabel', 'Custom aria label');
      fixture.detectChanges();

      expect(component.ariaLabel()).toBe('Custom aria label');
    });

    it('should accept ariaDescribedBy input', () => {
      fixture.componentRef.setInput('ariaDescribedBy', 'custom-description-id');
      fixture.detectChanges();

      expect(component.ariaDescribedBy()).toBe('custom-description-id');
    });
  });

  describe('rendering', () => {
    it('should render title when provided', () => {
      fixture.componentRef.setInput('title', 'Test Title');
      fixture.detectChanges();

      const titleElement = fixture.nativeElement.querySelector('.os-chart-container__title');
      expect(titleElement).toBeTruthy();
      expect(titleElement.textContent.trim()).toBe('Test Title');
    });

    it('should render subtitle when provided', () => {
      fixture.componentRef.setInput('subtitle', 'Test Subtitle');
      fixture.detectChanges();

      const subtitleElement = fixture.nativeElement.querySelector('.os-chart-container__subtitle');
      expect(subtitleElement).toBeTruthy();
      expect(subtitleElement.textContent.trim()).toBe('Test Subtitle');
    });

    it('should render loading state', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      const loadingElement = fixture.nativeElement.querySelector('.os-chart-container__loading');
      expect(loadingElement).toBeTruthy();
    });

    it('should render error state', () => {
      fixture.componentRef.setInput('error', 'Error message');
      fixture.detectChanges();

      const errorElement = fixture.nativeElement.querySelector('.os-chart-container__error');
      expect(errorElement).toBeTruthy();
      const errorMessage = fixture.nativeElement.querySelector('.os-chart-container__error-message');
      expect(errorMessage.textContent.trim()).toBe('Error message');
    });

    it('should render retry button when retryable', () => {
      fixture.componentRef.setInput('error', 'Error message');
      fixture.componentRef.setInput('retryable', true);
      fixture.detectChanges();

      const retryButton = fixture.nativeElement.querySelector('os-button');
      expect(retryButton).toBeTruthy();
    });

    it('should render empty state', () => {
      fixture.componentRef.setInput('empty', true);
      fixture.detectChanges();

      const emptyElement = fixture.nativeElement.querySelector('.os-chart-container__empty');
      expect(emptyElement).toBeTruthy();
    });

    it('should render chart content when not loading, error or empty', () => {
      fixture.componentRef.setInput('loading', false);
      fixture.componentRef.setInput('error', null);
      fixture.componentRef.setInput('empty', false);
      fixture.detectChanges();

      const chartElement = fixture.nativeElement.querySelector('.os-chart-container__chart');
      expect(chartElement).toBeTruthy();
    });
  });
});
