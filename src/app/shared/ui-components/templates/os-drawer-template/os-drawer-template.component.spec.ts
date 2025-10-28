import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';

import { OsButtonComponent } from '../../atoms/os-button/os-button.component';
import { DrawerTemplateConfig, OsDrawerTemplateComponent } from './os-drawer-template.component';

describe('OsDrawerTemplateComponent', () => {
  let component: OsDrawerTemplateComponent;
  let fixture: ComponentFixture<OsDrawerTemplateComponent>;

  const mockConfig: DrawerTemplateConfig = {
    title: 'Test Drawer',
    subtitle: 'Test subtitle',
    showCloseButton: true,
    showHeader: true,
    showFooter: true,
    showActions: true,
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OsDrawerTemplateComponent, OsButtonComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(OsDrawerTemplateComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('config', mockConfig);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render header with title and subtitle', () => {
    const header = fixture.debugElement.query(By.css('.os-drawer-template__header'));
    const title = fixture.debugElement.query(By.css('.os-drawer-template__title'));
    const subtitle = fixture.debugElement.query(By.css('.os-drawer-template__subtitle'));

    expect(header).toBeTruthy();
    expect(title.nativeElement.textContent.trim()).toBe('Test Drawer');
    expect(subtitle.nativeElement.textContent.trim()).toBe('Test subtitle');
  });

  it('should render close button when showCloseButton is true', () => {
    const closeButton = fixture.debugElement.query(By.css('os-button[aria-label="Fechar drawer"]'));
    expect(closeButton).toBeTruthy();
  });

  it('should not render close button when showCloseButton is false', () => {
    fixture.componentRef.setInput('config', { ...mockConfig, showCloseButton: false });
    fixture.detectChanges();

    const closeButton = fixture.debugElement.query(By.css('os-button[icon="close"]'));
    expect(closeButton).toBeFalsy();
  });

  it('should render actions when showActions is true', () => {
    const actions = fixture.debugElement.query(By.css('.os-drawer-template__actions'));
    const buttons = fixture.debugElement.queryAll(By.css('os-button'));

    expect(actions).toBeTruthy();
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should not render actions when showActions is false', () => {
    fixture.componentRef.setInput('config', { ...mockConfig, showActions: false });
    fixture.detectChanges();

    const actions = fixture.debugElement.query(By.css('.os-drawer-template__actions'));
    expect(actions).toBeFalsy();
  });

  it('should apply correct CSS classes based on variant', () => {
    fixture.componentRef.setInput('variant', 'compact');
    fixture.detectChanges();

    const drawer = fixture.debugElement.query(By.css('.os-drawer-template'));
    expect(drawer.nativeElement.classList).toContain('os-drawer-template--compact');
  });

  it('should apply correct CSS classes based on size', () => {
    fixture.componentRef.setInput('size', 'large');
    fixture.detectChanges();

    const drawer = fixture.debugElement.query(By.css('.os-drawer-template'));
    expect(drawer.nativeElement.classList).toContain('os-drawer-template--large');
  });

  it('should apply correct CSS classes based on theme', () => {
    fixture.componentRef.setInput('theme', 'dark');
    fixture.detectChanges();

    const drawer = fixture.debugElement.query(By.css('.os-drawer-template'));
    expect(drawer.nativeElement.classList).toContain('os-drawer-template--dark');
  });

  it('should apply correct CSS classes based on position', () => {
    fixture.componentRef.setInput('position', 'left');
    fixture.detectChanges();

    const drawer = fixture.debugElement.query(By.css('.os-drawer-template'));
    expect(drawer.nativeElement.classList).toContain('os-drawer-template--left');
  });

  it('should apply disabled class when disabled is true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const drawer = fixture.debugElement.query(By.css('.os-drawer-template'));
    expect(drawer.nativeElement.classList).toContain('os-drawer-template--disabled');
  });

  it('should apply loading class when loading is true', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const drawer = fixture.debugElement.query(By.css('.os-drawer-template'));
    expect(drawer.nativeElement.classList).toContain('os-drawer-template--loading');
  });

  it('should emit close event when close button is clicked', () => {
    vi.spyOn(component.closed, 'emit');
    const closeButton = fixture.debugElement.query(By.css('os-button[aria-label="Fechar drawer"]'));
    closeButton.triggerEventHandler('click', null);

    expect(component.closed.emit).toHaveBeenCalled();
  });

  it('should emit cancel event when cancel button is clicked', () => {
    vi.spyOn(component.cancelled, 'emit');
    
    const buttons = fixture.debugElement.queryAll(By.css('os-button'));
    const cancelButton = buttons[1]; 
    cancelButton?.triggerEventHandler('click', null);

    expect(component.cancelled.emit).toHaveBeenCalled();
  });

  it('should emit confirm event when confirm button is clicked', () => {
    vi.spyOn(component.confirmed, 'emit');
    
    const buttons = fixture.debugElement.queryAll(By.css('os-button'));
    const confirmButton = buttons[2]; 
    confirmButton?.triggerEventHandler('click', null);

    expect(component.confirmed.emit).toHaveBeenCalled();
  });

  it('should render custom actions when provided', () => {
    const customActions = [
      {
        label: 'Custom Action',
        variant: 'tertiary' as const,
        size: 'medium' as const,
        icon: 'star',
      },
    ];

    fixture.componentRef.setInput('config', { ...mockConfig, actions: customActions });
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('os-button'));
    
    expect(buttons.length).toBe(4);
  });

  it('should emit actionClick event when custom action is clicked', () => {
    const customActions = [
      {
        label: 'Custom Action',
        variant: 'tertiary' as const,
        size: 'medium' as const,
        icon: 'star',
      },
    ];

    fixture.componentRef.setInput('config', { ...mockConfig, actions: customActions });
    fixture.detectChanges();

    vi.spyOn(component.actionClick, 'emit');
    const buttons = fixture.debugElement.queryAll(By.css('os-button'));
    
    const customButton = buttons[3];
    customButton?.triggerEventHandler('click', null);

    expect(component.actionClick.emit).toHaveBeenCalledWith(customActions[0]);
  });

  it('should disable confirm button when valid is false', () => {
    fixture.componentRef.setInput('valid', false);
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('os-button'));
    const confirmButton = buttons[2]; 
    expect(confirmButton?.componentInstance.disabled()).toBe(true);
  });

  it('should show loading state on confirm button when loading is true', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('os-button'));
    const confirmButton = buttons[2]; 
    expect(confirmButton?.componentInstance.loading()).toBe(true);
  });

  it('should have proper ARIA label', () => {
    const drawer = fixture.debugElement.query(By.css('.os-drawer-template'));
    expect(drawer.nativeElement.getAttribute('aria-label')).toBe('Drawer: Test Drawer');
  });

  it('should have proper ARIA label for close button', () => {
    const closeButton = fixture.debugElement.query(By.css('os-button[aria-label="Fechar drawer"]'));
    expect(closeButton?.nativeElement.getAttribute('aria-label')).toBe('Fechar drawer');
  });

  it('should render content projection', () => {
    const content = fixture.debugElement.query(By.css('.os-drawer-template__content'));
    expect(content).toBeTruthy();
  });

  it('should not render header when showHeader is false', () => {
    fixture.componentRef.setInput('config', { ...mockConfig, showHeader: false });
    fixture.detectChanges();

    const header = fixture.debugElement.query(By.css('.os-drawer-template__header'));
    expect(header).toBeFalsy();
  });

  it('should not render cancel button when showCancelButton is false', () => {
    fixture.componentRef.setInput('config', { ...mockConfig, showCancelButton: false });
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('os-button'));
    
    expect(buttons.length).toBe(2);
  });

  it('should not render confirm button when showConfirmButton is false', () => {
    fixture.componentRef.setInput('config', { ...mockConfig, showConfirmButton: false });
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('os-button'));
    
    expect(buttons.length).toBe(2);
  });

  it('should use default button texts when not provided', () => {
    fixture.componentRef.setInput('config', {
      title: 'Test',
      showConfirmButton: true,
      showCancelButton: true,
    });
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('os-button'));
    
    expect(buttons.length).toBe(3);
  });

  it('should handle multiple custom actions', () => {
    const customActions = [
      {
        label: 'Action 1',
        variant: 'primary' as const,
        size: 'small' as const,
      },
      {
        label: 'Action 2',
        variant: 'secondary' as const,
        size: 'medium' as const,
      },
    ];

    fixture.componentRef.setInput('config', { ...mockConfig, actions: customActions });
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('os-button'));
    
    expect(buttons.length).toBe(5);
  });

  it('should handle disabled custom actions', () => {
    const customActions = [
      {
        label: 'Disabled Action',
        variant: 'primary' as const,
        size: 'medium' as const,
        disabled: true,
      },
    ];

    fixture.componentRef.setInput('config', { ...mockConfig, actions: customActions });
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('os-button'));
    
    const disabledButton = buttons[3];
    expect(disabledButton?.componentInstance.disabled()).toBe(true);
  });

  it('should handle loading custom actions', () => {
    const customActions = [
      {
        label: 'Loading Action',
        variant: 'primary' as const,
        size: 'medium' as const,
        loading: true,
      },
    ];

    fixture.componentRef.setInput('config', { ...mockConfig, actions: customActions });
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('os-button'));
    
    const loadingButton = buttons[3];
    expect(loadingButton?.componentInstance.loading()).toBe(true);
  });
});
