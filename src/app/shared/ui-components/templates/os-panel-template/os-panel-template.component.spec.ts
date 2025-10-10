import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';

import { OsPanelTemplateComponent, PanelTemplateConfig } from './os-panel-template.component';

describe('OsPanelTemplateComponent', () => {
  let component: OsPanelTemplateComponent;
  let fixture: ComponentFixture<OsPanelTemplateComponent>;

  const mockConfig: PanelTemplateConfig = {
    title: 'Test Panel',
    subtitle: 'Test Subtitle',
    showHeader: true,
    showFooter: false,
    showActions: true,
    collapsible: false,
    expanded: true,
    actions: [
      {
        label: 'Action 1',
        variant: 'primary',
        size: 'medium',
        disabled: false,
        loading: false,
        icon: 'save',
      },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OsPanelTemplateComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(OsPanelTemplateComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('config', mockConfig);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render panel with correct title', () => {
    const titleElement = fixture.debugElement.nativeElement.querySelector(
      '.os-panel-template__title'
    );
    expect(titleElement).toBeTruthy();
    expect(titleElement.textContent.trim()).toBe('Test Panel');
  });

  it('should render panel with subtitle when provided', () => {
    const subtitleElement = fixture.debugElement.nativeElement.querySelector(
      '.os-panel-template__subtitle'
    );
    expect(subtitleElement).toBeTruthy();
    expect(subtitleElement.textContent.trim()).toBe('Test Subtitle');
  });

  it('should not render subtitle when not provided', () => {
    const configWithoutSubtitle = { ...mockConfig, subtitle: undefined };
    fixture.componentRef.setInput('config', configWithoutSubtitle);
    fixture.detectChanges();

    const subtitleElement = fixture.debugElement.nativeElement.querySelector(
      '.os-panel-template__subtitle'
    );
    expect(subtitleElement).toBeFalsy();
  });

  it('should apply correct size classes', () => {
    fixture.componentRef.setInput('size', 'large');
    fixture.detectChanges();

    const panelElement = fixture.debugElement.nativeElement.querySelector('.os-panel-template');
    expect(panelElement.classList.contains('os-panel-template--large')).toBe(true);
  });

  it('should apply correct variant classes', () => {
    fixture.componentRef.setInput('variant', 'compact');
    fixture.detectChanges();

    const panelElement = fixture.debugElement.nativeElement.querySelector('.os-panel-template');
    expect(panelElement.classList.contains('os-panel-template--compact')).toBe(true);
  });

  it('should apply correct theme classes', () => {
    fixture.componentRef.setInput('theme', 'dark');
    fixture.detectChanges();

    const panelElement = fixture.debugElement.nativeElement.querySelector('.os-panel-template');
    expect(panelElement.classList.contains('os-panel-template--dark')).toBe(true);
  });

  it('should apply disabled class when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const panelElement = fixture.debugElement.nativeElement.querySelector('.os-panel-template');
    expect(panelElement.classList.contains('os-panel-template--disabled')).toBe(true);
  });

  it('should apply loading class when loading', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const panelElement = fixture.debugElement.nativeElement.querySelector('.os-panel-template');
    expect(panelElement.classList.contains('os-panel-template--loading')).toBe(true);
  });

  it('should render actions when provided', () => {
    const actionsElement = fixture.debugElement.nativeElement.querySelector(
      '.os-panel-template__actions'
    );
    expect(actionsElement).toBeTruthy();

    const buttonElements = actionsElement.querySelectorAll('os-button');
    expect(buttonElements.length).toBe(1);
  });

  it('should not render actions when showActions is false', () => {
    const configWithoutActions = { ...mockConfig, showActions: false };
    fixture.componentRef.setInput('config', configWithoutActions);
    fixture.detectChanges();

    const actionsElement = fixture.debugElement.nativeElement.querySelector(
      '.os-panel-template__actions'
    );
    expect(actionsElement).toBeFalsy();
  });

  it('should emit actionClick when action button is clicked', () => {
    const actionClickSpy = vi.spyOn(component.actionClick, 'emit');

    const buttonElement = fixture.debugElement.nativeElement.querySelector('os-button');
    buttonElement.click();

    expect(actionClickSpy).toHaveBeenCalledWith(mockConfig.actions![0]);
  });

  it('should render collapsible button when collapsible is true', () => {
    const collapsibleConfig = { ...mockConfig, collapsible: true };
    fixture.componentRef.setInput('config', collapsibleConfig);
    fixture.detectChanges();

    const headerElement = fixture.debugElement.nativeElement.querySelector(
      '.os-panel-template__header'
    );
    const buttonElements = headerElement.querySelectorAll('os-button');
    expect(buttonElements.length).toBe(1);
  });

  it('should show correct expand/collapse icon based on expanded state', () => {
    const collapsibleConfig = { ...mockConfig, collapsible: true };
    fixture.componentRef.setInput('config', collapsibleConfig);
    fixture.componentRef.setInput('expanded', true);
    fixture.detectChanges();

    const buttonComponent = fixture.debugElement.query(By.css('os-button')).componentInstance;
    expect(buttonComponent.icon()).toBe('expand_less');

    fixture.componentRef.setInput('expanded', false);
    fixture.detectChanges();

    expect(buttonComponent.icon()).toBe('expand_more');
  });

  it('should emit toggle event when collapsible button is clicked', () => {
    const toggleSpy = vi.spyOn(component.toggled, 'emit');
    const collapsibleConfig = { ...mockConfig, collapsible: true };
    fixture.componentRef.setInput('config', collapsibleConfig);
    fixture.detectChanges();

    const buttonElement = fixture.debugElement.nativeElement.querySelector('os-button');
    buttonElement.click();

    expect(toggleSpy).toHaveBeenCalledWith(false);
  });

  it('should hide content when collapsed', () => {
    const collapsibleConfig = { ...mockConfig, collapsible: true };
    fixture.componentRef.setInput('config', collapsibleConfig);
    fixture.componentRef.setInput('expanded', false);
    fixture.detectChanges();

    const contentElement = fixture.debugElement.nativeElement.querySelector(
      '.os-panel-template__content'
    );
    expect(contentElement).toBeFalsy();
  });

  it('should show content when expanded', () => {
    const collapsibleConfig = { ...mockConfig, collapsible: true };
    fixture.componentRef.setInput('config', collapsibleConfig);
    fixture.componentRef.setInput('expanded', true);
    fixture.detectChanges();

    const contentElement = fixture.debugElement.nativeElement.querySelector(
      '.os-panel-template__content'
    );
    expect(contentElement).toBeTruthy();
  });

  it('should have proper ARIA attributes', () => {
    const panelElement = fixture.debugElement.nativeElement.querySelector('.os-panel-template');
    expect(panelElement.getAttribute('aria-label')).toBe('Painel: Test Panel');
  });

  it('should have proper ARIA attributes for collapsible button', () => {
    const collapsibleConfig = { ...mockConfig, collapsible: true };
    fixture.componentRef.setInput('config', collapsibleConfig);
    fixture.detectChanges();

    const buttonElement = fixture.debugElement.nativeElement.querySelector('os-button');
    expect(buttonElement.getAttribute('aria-label')).toBe('Recolher painel');
  });

  it('should handle multiple actions correctly', () => {
    const multiActionConfig = {
      ...mockConfig,
      actions: [
        { label: 'Save', variant: 'primary' as const, size: 'medium' as const },
        { label: 'Cancel', variant: 'secondary' as const, size: 'medium' as const },
        { label: 'Delete', variant: 'danger' as const, size: 'medium' as const },
      ],
    };

    fixture.componentRef.setInput('config', multiActionConfig);
    fixture.detectChanges();

    const buttonElements = fixture.debugElement.nativeElement.querySelectorAll('os-button');
    expect(buttonElements.length).toBe(3);
  });

  it('should handle action with icon correctly', () => {
    const actionWithIcon = {
      label: 'Save',
      variant: 'primary' as const,
      size: 'medium' as const,
      icon: 'save',
    };

    const configWithIcon = { ...mockConfig, actions: [actionWithIcon] };
    fixture.componentRef.setInput('config', configWithIcon);
    fixture.detectChanges();

    const buttonComponent = fixture.debugElement.query(
      By.css('.os-panel-template__actions os-button')
    ).componentInstance;
    expect(buttonComponent.icon()).toBe('save');
  });

  it('should handle disabled action correctly', () => {
    const disabledAction = {
      label: 'Disabled Action',
      variant: 'primary' as const,
      size: 'medium' as const,
      disabled: true,
    };

    const configWithDisabled = { ...mockConfig, actions: [disabledAction] };
    fixture.componentRef.setInput('config', configWithDisabled);
    fixture.detectChanges();

    const buttonComponent = fixture.debugElement.query(
      By.css('.os-panel-template__actions os-button')
    ).componentInstance;
    expect(buttonComponent.disabled()).toBe(true);
  });

  it('should handle loading action correctly', () => {
    const loadingAction = {
      label: 'Loading Action',
      variant: 'primary' as const,
      size: 'medium' as const,
      loading: true,
    };

    const configWithLoading = { ...mockConfig, actions: [loadingAction] };
    fixture.componentRef.setInput('config', configWithLoading);
    fixture.detectChanges();

    const buttonComponent = fixture.debugElement.query(
      By.css('.os-panel-template__actions os-button')
    ).componentInstance;
    expect(buttonComponent.loading()).toBe(true);
  });

  it('should handle empty actions array', () => {
    const configWithEmptyActions = { ...mockConfig, actions: [] };
    fixture.componentRef.setInput('config', configWithEmptyActions);
    fixture.detectChanges();

    const actionsElement = fixture.debugElement.nativeElement.querySelector(
      '.os-panel-template__actions'
    );
    expect(actionsElement).toBeTruthy();

    const buttonElements = actionsElement.querySelectorAll('os-button');
    expect(buttonElements.length).toBe(0);
  });

  it('should handle undefined actions', () => {
    const configWithUndefinedActions = { ...mockConfig, actions: undefined };
    fixture.componentRef.setInput('config', configWithUndefinedActions);
    fixture.detectChanges();

    const actionsElement = fixture.debugElement.nativeElement.querySelector(
      '.os-panel-template__actions'
    );
    expect(actionsElement).toBeTruthy();

    const buttonElements = actionsElement.querySelectorAll('os-button');
    expect(buttonElements.length).toBe(0);
  });
});
