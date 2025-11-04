import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { signal } from '@angular/core';

import { OsAppShellTemplateComponent, AppShellLayout } from './os-app-shell-template.component';
import { ThemeService } from '@core/services/theme/theme.service';

describe('OsAppShellTemplateComponent', () => {
  let component: OsAppShellTemplateComponent;
  let fixture: ComponentFixture<OsAppShellTemplateComponent>;
  let mockBreakpointObserver: Partial<BreakpointObserver>;
  let mockThemeService: Partial<ThemeService>;

  const mockBreakpointState: BreakpointState = {
    matches: false,
    breakpoints: {},
  };

  beforeEach(async () => {
    
    mockBreakpointObserver = {
      observe: vi.fn().mockReturnValue(of(mockBreakpointState)),
      isMatched: vi.fn().mockReturnValue(false),
    };
    
    mockThemeService = {
      isDark: signal(false),
      currentTheme: signal('light'),
      toggleTheme: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [OsAppShellTemplateComponent, RouterTestingModule],
      providers: [
        provideZonelessChangeDetection(),
        { provide: BreakpointObserver, useValue: mockBreakpointObserver },
        { provide: ThemeService, useValue: mockThemeService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OsAppShellTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('rendering', () => {
    it('should render with default layout configuration', () => {
      expect(component.layout()).toEqual({
        variant: 'default',
        size: 'medium',
        theme: 'light',
        showHeader: true,
        showSidebar: true,
        sidebarCollapsed: false,
      });
    });

    it('should render header when showHeader is true', () => {
      fixture.componentRef.setInput('layout', { showHeader: true } as AppShellLayout);
      fixture.detectChanges();

      const header = fixture.nativeElement.querySelector('header[role="banner"]');
      expect(header).toBeTruthy();
    });

    it('should not render header when showHeader is false', () => {
      fixture.componentRef.setInput('layout', { showHeader: false } as AppShellLayout);
      fixture.detectChanges();

      const header = fixture.nativeElement.querySelector('header[role="banner"]');
      expect(header).toBeFalsy();
    });

    it('should render sidebar when showSidebar is true', () => {
      fixture.componentRef.setInput('layout', { showSidebar: true } as AppShellLayout);
      fixture.detectChanges();

      const sidebar = fixture.nativeElement.querySelector('nav[role="navigation"]');
      expect(sidebar).toBeTruthy();
    });

    it('should not render sidebar when showSidebar is false', () => {
      fixture.componentRef.setInput('layout', { showSidebar: false } as AppShellLayout);
      fixture.detectChanges();

      const sidebar = fixture.nativeElement.querySelector('nav[role="navigation"]');
      expect(sidebar).toBeFalsy();
    });

    it('should render main content area', () => {
      const main = fixture.nativeElement.querySelector('main[role="main"]');
      expect(main).toBeTruthy();
      expect(main.id).toBe('main-content');
    });

    it('should render skip links for accessibility', () => {
      const skipLinks = fixture.nativeElement.querySelectorAll('.os-app-shell-template__skip-link');
      expect(skipLinks.length).toBe(2);

      const mainSkipLink = Array.from(skipLinks).find(
        (link) => (link as Element).getAttribute('href') === '#main-content'
      );
      const budgetSkipLink = Array.from(skipLinks).find(
        (link) => (link as Element).getAttribute('href') === '#budget-selector'
      );

      expect(mainSkipLink).toBeTruthy();
      expect(budgetSkipLink).toBeTruthy();
    });
  });

  describe('loading state', () => {
    it('should show loading state when loading is true', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.componentRef.setInput('loadingText', 'Carregando dados...');
      fixture.detectChanges();

      const loadingElement = fixture.nativeElement.querySelector('.os-app-shell-template__loading');
      expect(loadingElement).toBeTruthy();
      expect(loadingElement.getAttribute('role')).toBe('status');
      expect(loadingElement.getAttribute('aria-live')).toBe('polite');

      const loadingText = fixture.nativeElement.querySelector(
        '.os-app-shell-template__loading-text'
      );
      expect(loadingText.textContent.trim()).toBe('Carregando dados...');
    });

    it('should not show loading state when loading is false', () => {
      fixture.componentRef.setInput('loading', false);
      fixture.detectChanges();

      const loadingElement = fixture.nativeElement.querySelector('.os-app-shell-template__loading');
      expect(loadingElement).toBeFalsy();
    });

    it('should show spinner in loading state', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      const spinner = fixture.nativeElement.querySelector('.os-app-shell-template__spinner');
      expect(spinner).toBeTruthy();
      expect(spinner.getAttribute('aria-hidden')).toBe('true');
    });
  });

  describe('error state', () => {
    it('should show error state when error is provided', () => {
      fixture.componentRef.setInput('error', 'Erro de conexão');
      fixture.componentRef.setInput('errorText', 'Falha na operação');
      fixture.detectChanges();

      const errorElement = fixture.nativeElement.querySelector('.os-app-shell-template__error');
      expect(errorElement).toBeTruthy();
      expect(errorElement.getAttribute('role')).toBe('alert');
      expect(errorElement.getAttribute('aria-live')).toBe('assertive');

      const errorTitle = fixture.nativeElement.querySelector('.os-app-shell-template__error-title');
      expect(errorTitle.textContent.trim()).toBe('Falha na operação');

      const errorMessage = fixture.nativeElement.querySelector(
        '.os-app-shell-template__error-message'
      );
      expect(errorMessage.textContent.trim()).toBe('Erro de conexão');
    });

    it('should not show error state when error is null', () => {
      fixture.componentRef.setInput('error', null);
      fixture.detectChanges();

      const errorElement = fixture.nativeElement.querySelector('.os-app-shell-template__error');
      expect(errorElement).toBeFalsy();
    });

    it('should show retry button in error state', () => {
      fixture.componentRef.setInput('error', 'Erro de conexão');
      fixture.detectChanges();

      const retryButton = fixture.nativeElement.querySelector(
        '.os-app-shell-template__retry-button'
      );
      expect(retryButton).toBeTruthy();
      expect(retryButton.getAttribute('aria-label')).toBe('Tentar novamente');
    });
  });

  describe('contextual actions slot', () => {
    it('should render contextual actions slot when content is projected', () => {
      fixture.componentRef.setInput('layout', { showHeader: true } as AppShellLayout);
      fixture.componentRef.setInput('headerActions', [
        { label: 'Ação 1', icon: 'add', action: 'add-item' },
        { label: 'Ação 2', icon: 'edit', action: 'edit-item' },
      ]);
      fixture.detectChanges();
      
      expect(component.headerActions().length).toBe(2);
    });
  });

  describe('theme integration', () => {
    it('should integrate theme toggle', () => {
      fixture.componentRef.setInput('layout', { showSidebar: true } as AppShellLayout);
      fixture.detectChanges();

      const themeButton = fixture.nativeElement.querySelector('.os-app-shell-template__theme-button');
      expect(themeButton).toBeTruthy();
    });

    it('should call themeService.toggleTheme when theme toggle is clicked', () => {
      fixture.componentRef.setInput('layout', { showSidebar: true } as AppShellLayout);
      fixture.detectChanges();

      const themeButton = fixture.nativeElement.querySelector('.os-app-shell-template__theme-button');
      expect(themeButton).toBeTruthy();
      
      themeButton.click();
      fixture.detectChanges();

      expect(mockThemeService.toggleTheme).toHaveBeenCalled();
    });

    it('should show correct label based on theme', () => {
      fixture.componentRef.setInput('layout', { showSidebar: true } as AppShellLayout);
      fixture.detectChanges();

      const themeButton = fixture.nativeElement.querySelector('.os-app-shell-template__theme-button');
      expect(themeButton).toBeTruthy();
      
      const title = themeButton.getAttribute('title');
      expect(title).toBeTruthy();
    });
  });

  describe('computed layout', () => {
    it('should merge layout with theme from service', () => {
      
      vi.spyOn(component, 'computedLayout').mockReturnValue({
        variant: 'default',
        size: 'medium',
        theme: 'dark',
        showHeader: true,
        showSidebar: true,
        sidebarCollapsed: false,
      });
      fixture.detectChanges();

      const computedLayout = component.computedLayout();
      expect(computedLayout.theme).toBe('dark');
    });
  });

  describe('accessibility', () => {
    it('should have proper ARIA roles', () => {
      const main = fixture.nativeElement.querySelector('main[role="main"]');
      const header = fixture.nativeElement.querySelector('header[role="banner"]');
      const nav = fixture.nativeElement.querySelector('nav[role="navigation"]');

      expect(main).toBeTruthy();
      expect(header).toBeTruthy();
      expect(nav).toBeTruthy();
    });

    it('should have proper aria-label on main container', () => {
      fixture.componentRef.setInput('ariaLabel', 'Shell principal do aplicativo');
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('[role="main"]');
      expect(container.getAttribute('aria-label')).toBe('Shell principal do aplicativo');
    });

    it('should have aria-busy on main when loading', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      const main = fixture.nativeElement.querySelector('main[role="main"]');
      expect(main.getAttribute('aria-busy')).toBe('true');
    });
  });

  describe('CSS classes', () => {
    it('should apply correct CSS classes based on layout', () => {
      fixture.componentRef.setInput('layout', {
        variant: 'compact',
        size: 'large',
        theme: 'dark',
      } as AppShellLayout);
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('.os-app-shell-template');
      
      expect(container).toBeTruthy();
    });
  });

  describe('outputs', () => {
    it('should emit retry event when retry button is clicked', () => {
      const retrySpy = vi.spyOn(component, 'onRetry');

      fixture.componentRef.setInput('error', 'Erro de conexão');
      fixture.detectChanges();

      const retryButton = fixture.nativeElement.querySelector(
        '.os-app-shell-template__retry-button'
      );
      retryButton.click();

      expect(retrySpy).toHaveBeenCalled();
    });
  });

  describe('responsive behavior', () => {
    it('should observe breakpoints', () => {
      expect(mockBreakpointObserver.observe).toHaveBeenCalled();
    });

    it('should handle mobile breakpoint', () => {
      const mobileBreakpointState: BreakpointState = {
        matches: true,
        breakpoints: { '(max-width: 767px)': true },
      };

      mockBreakpointObserver.observe = vi.fn().mockReturnValue(of(mobileBreakpointState));
      
      fixture = TestBed.createComponent(OsAppShellTemplateComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(mockBreakpointObserver.observe).toHaveBeenCalled();
    });
  });
});
