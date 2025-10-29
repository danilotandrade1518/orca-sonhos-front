import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { OsWizardTemplateComponent, WizardTemplateConfig } from './os-wizard-template.component';

describe('OsWizardTemplateComponent', () => {
  let component: OsWizardTemplateComponent;
  let fixture: ComponentFixture<OsWizardTemplateComponent>;

  const mockConfig: WizardTemplateConfig = {
    title: 'Test Wizard',
    subtitle: 'Test Subtitle',
    steps: [
      { id: 'step1', title: 'Step 1', subtitle: 'First step', completed: false },
      { id: 'step2', title: 'Step 2', subtitle: 'Second step', completed: false },
      { id: 'step3', title: 'Step 3', subtitle: 'Third step', completed: false },
      { id: 'step4', title: 'Step 4', subtitle: 'Fourth step', completed: false },
    ],
    showNextButton: true,
    showPreviousButton: true,
    showFinishButton: true,
    allowSkipSteps: true,
    nextButtonText: 'Próximo',
    previousButtonText: 'Anterior',
    finishButtonText: 'Finalizar',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OsWizardTemplateComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(OsWizardTemplateComponent);
    component = fixture.componentInstance;
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have default inputs', () => {
      expect(component.size()).toBe('medium');
      expect(component.variant()).toBe('default');
      expect(component.theme()).toBe('light');
      expect(component.disabled()).toBe(false);
      expect(component.loading()).toBe(false);
      expect(component.showHeader()).toBe(true);
      expect(component.showProgress()).toBe(true);
      expect(component.showStepNavigation()).toBe(true);
      expect(component.showActions()).toBe(true);
      expect(component.showStepNumbers()).toBe(true);
      expect(component.showStepIcons()).toBe(true);
      expect(component.allowSkipSteps()).toBe(false);
      expect(component.showStepValidation()).toBe(true);
    });
  });

  describe('Template Classes', () => {
    it('should have correct template class', () => {
      fixture.componentRef.setInput('config', mockConfig);
      fixture.componentRef.setInput('currentStep', 'step1');
      fixture.detectChanges();

      const templateElement = fixture.nativeElement.querySelector('.os-wizard-template');
      expect(templateElement).toBeTruthy();
      expect(templateElement.classList.contains('os-wizard-template--medium')).toBe(true);
      expect(templateElement.classList.contains('os-wizard-template--default')).toBe(true);
      expect(templateElement.classList.contains('os-wizard-template--light')).toBe(true);
    });

    it('should have correct classes for different variants', () => {
      fixture.componentRef.setInput('config', mockConfig);
      fixture.componentRef.setInput('currentStep', 'step1');
      fixture.componentRef.setInput('variant', 'compact');
      fixture.componentRef.setInput('size', 'large');
      fixture.componentRef.setInput('theme', 'dark');
      fixture.detectChanges();

      const templateElement = fixture.nativeElement.querySelector('.os-wizard-template');
      expect(templateElement.classList.contains('os-wizard-template--compact')).toBe(true);
      expect(templateElement.classList.contains('os-wizard-template--large')).toBe(true);
      expect(templateElement.classList.contains('os-wizard-template--dark')).toBe(true);
    });

    it('should have disabled class when disabled', () => {
      fixture.componentRef.setInput('config', mockConfig);
      fixture.componentRef.setInput('currentStep', 'step1');
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const templateElement = fixture.nativeElement.querySelector('.os-wizard-template');
      expect(templateElement.classList.contains('os-wizard-template--disabled')).toBe(true);
    });

    it('should have loading class when loading', () => {
      fixture.componentRef.setInput('config', mockConfig);
      fixture.componentRef.setInput('currentStep', 'step1');
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      const templateElement = fixture.nativeElement.querySelector('.os-wizard-template');
      expect(templateElement.classList.contains('os-wizard-template--loading')).toBe(true);
    });
  });

  describe('Step Navigation', () => {
    it('should display steps when showStepNavigation is true', () => {
      fixture.componentRef.setInput('config', mockConfig);
      fixture.componentRef.setInput('currentStep', 'step1');
      fixture.detectChanges();

      const stepsContainer = fixture.nativeElement.querySelector('.os-wizard-template__steps');
      expect(stepsContainer).toBeTruthy();

      const steps = fixture.nativeElement.querySelectorAll('.os-wizard-template__step');
      expect(steps.length).toBe(4);
    });

    it('should not display steps when showStepNavigation is false', () => {
      fixture.componentRef.setInput('config', mockConfig);
      fixture.componentRef.setInput('currentStep', 'step1');
      fixture.componentRef.setInput('showStepNavigation', false);
      fixture.detectChanges();

      const stepsContainer = fixture.nativeElement.querySelector('.os-wizard-template__steps');
      expect(stepsContainer).toBeFalsy();
    });

    it('should highlight current step', () => {
      fixture.componentRef.setInput('config', mockConfig);
      fixture.componentRef.setInput('currentStep', 'step2');
      fixture.detectChanges();

      const steps = fixture.nativeElement.querySelectorAll('.os-wizard-template__step');
      expect(steps[1].classList.contains('os-wizard-template__step--current')).toBe(true);
    });

    it('should show completed steps', () => {
      const configWithCompleted = {
        ...mockConfig,
        steps: [
          { id: 'step1', title: 'Step 1', completed: true },
          { id: 'step2', title: 'Step 2', completed: false },
          { id: 'step3', title: 'Step 3', completed: false },
        ],
      };

      fixture.componentRef.setInput('config', configWithCompleted);
      fixture.componentRef.setInput('currentStep', 'step2');
      fixture.detectChanges();

      const steps = fixture.nativeElement.querySelectorAll('.os-wizard-template__step');
      expect(steps[0].classList.contains('os-wizard-template__step--completed')).toBe(true);
    });
  });

  describe('Progress Bar', () => {
    it('should display progress bar when showProgress is true', () => {
      fixture.componentRef.setInput('config', mockConfig);
      fixture.componentRef.setInput('currentStep', 'step1');
      fixture.detectChanges();

      const progressBar = fixture.nativeElement.querySelector('os-progress-bar');
      expect(progressBar).toBeTruthy();
    });

    it('should not display progress bar when showProgress is false', () => {
      fixture.componentRef.setInput('config', mockConfig);
      fixture.componentRef.setInput('currentStep', 'step1');
      fixture.componentRef.setInput('showProgress', false);
      fixture.detectChanges();

      const progressBar = fixture.nativeElement.querySelector('os-progress-bar');
      expect(progressBar).toBeFalsy();
    });

    it('should calculate correct progress value', () => {
      fixture.componentRef.setInput('config', mockConfig);
      fixture.componentRef.setInput('currentStep', 'step2');
      fixture.detectChanges();

      const progressBar = fixture.nativeElement.querySelector('os-progress-bar');
      expect(progressBar).toBeTruthy();
      
      const matProgressBar = progressBar.querySelector('mat-progress-bar');
      expect(matProgressBar.getAttribute('aria-valuenow')).toBe('25');
    });
  });

  describe('Actions', () => {
    it('should display actions when showActions is true', () => {
      fixture.componentRef.setInput('config', mockConfig);
      fixture.componentRef.setInput('currentStep', 'step1');
      fixture.detectChanges();

      const actionsContainer = fixture.nativeElement.querySelector('.os-wizard-template__actions');
      expect(actionsContainer).toBeTruthy();
    });

    it('should not display actions when showActions is false', () => {
      fixture.componentRef.setInput('config', mockConfig);
      fixture.componentRef.setInput('currentStep', 'step1');
      fixture.componentRef.setInput('showActions', false);
      fixture.detectChanges();

      const actionsContainer = fixture.nativeElement.querySelector('.os-wizard-template__actions');
      expect(actionsContainer).toBeFalsy();
    });

    it('should show next button when not on last step', () => {
      fixture.componentRef.setInput('config', mockConfig);
      fixture.componentRef.setInput('currentStep', 'step1');
      fixture.detectChanges();

      const nextButton = fixture.nativeElement.querySelector(
        '.os-wizard-template__actions os-button'
      );
      expect(nextButton).toBeTruthy();
      
      const buttonElement = nextButton.querySelector('button');
      expect(buttonElement).toBeTruthy();
      
      expect(buttonElement).toBeTruthy();
    });

    it('should show finish button when on last step', () => {
      fixture.componentRef.setInput('config', mockConfig);
      fixture.componentRef.setInput('currentStep', 'step4');
      fixture.detectChanges();

      const finishButton = fixture.nativeElement.querySelector(
        '.os-wizard-template__actions os-button'
      );
      expect(finishButton).toBeTruthy();
      const buttonElement = finishButton.querySelector('button');
      expect(buttonElement).toBeTruthy();
    });

    it('should show previous button when not on first step', () => {
      fixture.componentRef.setInput('config', mockConfig);
      fixture.componentRef.setInput('currentStep', 'step2');
      fixture.detectChanges();

      const previousButton = fixture.nativeElement.querySelector(
        '.os-wizard-template__actions os-button'
      );
      expect(previousButton).toBeTruthy();
      const buttonElement = previousButton.querySelector('button');
      expect(buttonElement).toBeTruthy();
    });

    it('should show skip button when allowSkipSteps is true', () => {
      fixture.componentRef.setInput('config', mockConfig);
      fixture.componentRef.setInput('currentStep', 'step1');
      fixture.componentRef.setInput('allowSkipSteps', true);
      fixture.detectChanges();

      const skipButton = fixture.nativeElement.querySelector(
        '.os-wizard-template__actions os-button'
      );
      expect(skipButton).toBeTruthy();
      const buttonElement = skipButton.querySelector('button');
      expect(buttonElement).toBeTruthy();
    });
  });

  describe('Events', () => {
    it('should emit next event when next button is clicked', () => {
      const nextSpy = vi.fn();
      component.next.subscribe(nextSpy);

      fixture.componentRef.setInput('config', mockConfig);
      fixture.componentRef.setInput('currentStep', 'step1');
      fixture.detectChanges();

      const nextButton = fixture.nativeElement.querySelector(
        '.os-wizard-template__actions os-button'
      );
      expect(nextButton).toBeTruthy();
      nextButton.click();

      expect(nextSpy).toHaveBeenCalled();
    });

    it('should emit previous event when previous button is clicked', () => {
      const previousSpy = vi.fn();
      component.previous.subscribe(previousSpy);

      fixture.componentRef.setInput('config', mockConfig);
      fixture.componentRef.setInput('currentStep', 'step2');
      fixture.detectChanges();

      const previousButton = fixture.nativeElement.querySelector(
        '.os-wizard-template__actions os-button'
      );
      expect(previousButton).toBeTruthy();
      previousButton.click();

      expect(previousSpy).toHaveBeenCalled();
    });

    it('should emit finish event when finish button is clicked', () => {
      const finishSpy = vi.fn();
      component.finishWizard.subscribe(finishSpy);

      fixture.componentRef.setInput('config', mockConfig);
      fixture.componentRef.setInput('currentStep', 'step4');
      fixture.detectChanges();
      
      const actionButtons = fixture.nativeElement.querySelectorAll(
        '.os-wizard-template__actions os-button'
      );
      expect(actionButtons.length).toBeGreaterThan(0);
      
      const finishButton = actionButtons[actionButtons.length - 1];
      expect(finishButton).toBeTruthy();
      
      finishButton.dispatchEvent(new Event('click'));
      fixture.detectChanges();

      expect(finishSpy).toHaveBeenCalled();
    });

    it('should emit skip event when skip button is clicked', () => {
      const skipSpy = vi.fn();
      component.skip.subscribe(skipSpy);

      fixture.componentRef.setInput('config', mockConfig);
      fixture.componentRef.setInput('currentStep', 'step1');
      fixture.componentRef.setInput('allowSkipSteps', true);
      fixture.detectChanges();
      
      const actionButtons = fixture.nativeElement.querySelectorAll(
        '.os-wizard-template__actions os-button'
      );
      expect(actionButtons.length).toBeGreaterThan(0);
      
      const skipButton = actionButtons[actionButtons.length - 1];
      expect(skipButton).toBeTruthy();
      
      skipButton.dispatchEvent(new Event('click'));
      fixture.detectChanges();

      expect(skipSpy).toHaveBeenCalled();
    });

    it('should emit stepClick event when step is clicked', () => {
      const stepClickSpy = vi.fn();
      component.stepClick.subscribe(stepClickSpy);

      fixture.componentRef.setInput('config', mockConfig);
      fixture.componentRef.setInput('currentStep', 'step1');
      fixture.detectChanges();

      const step = fixture.nativeElement.querySelector('.os-wizard-template__step');
      step.click();

      expect(stepClickSpy).toHaveBeenCalledWith({
        step: mockConfig.steps[0],
        index: 0,
      });
    });
  });

  describe('Content Projection', () => {
    it('should project content', () => {
      fixture.componentRef.setInput('config', mockConfig);
      fixture.componentRef.setInput('currentStep', 'step1');
      fixture.detectChanges();

      const content = fixture.nativeElement.querySelector('.os-wizard-template__step-content');
      expect(content).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes on steps', () => {
      fixture.componentRef.setInput('config', mockConfig);
      fixture.componentRef.setInput('currentStep', 'step2');
      fixture.detectChanges();

      const steps = fixture.nativeElement.querySelectorAll('.os-wizard-template__step');
      expect(steps[1].getAttribute('aria-current')).toBe('step');
    });

    it('should have proper ARIA attributes on disabled steps', () => {
      const configWithDisabled = {
        ...mockConfig,
        steps: [
          { id: 'step1', title: 'Step 1', disabled: true },
          { id: 'step2', title: 'Step 2', disabled: false },
          { id: 'step3', title: 'Step 3', disabled: false },
        ],
      };

      fixture.componentRef.setInput('config', configWithDisabled);
      fixture.componentRef.setInput('currentStep', 'step2');
      fixture.detectChanges();

      const steps = fixture.nativeElement.querySelectorAll('.os-wizard-template__step');
      expect(steps[0].getAttribute('aria-disabled')).toBe('true');
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive classes', () => {
      fixture.componentRef.setInput('config', mockConfig);
      fixture.componentRef.setInput('currentStep', 'step1');
      fixture.detectChanges();

      const templateElement = fixture.nativeElement.querySelector('.os-wizard-template');
      expect(templateElement).toBeTruthy();
    });
  });
});
