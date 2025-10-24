import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { vi } from 'vitest';

import {
  OsDashboardTemplateComponent,
  DashboardWidget,
  DashboardLayout,
} from './os-dashboard-template.component';
import { provideZonelessChangeDetection } from '@angular/core';

describe('OsDashboardTemplateComponent', () => {
  let component: OsDashboardTemplateComponent;
  let fixture: ComponentFixture<OsDashboardTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OsDashboardTemplateComponent, RouterTestingModule],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(OsDashboardTemplateComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('rendering', () => {
    it('should render with default layout', () => {
      fixture.detectChanges();
      const element = fixture.nativeElement;
      expect(element.querySelector('.os-dashboard-template')).toBeTruthy();
    });

    it('should render with custom layout', () => {
      const customLayout: DashboardLayout = {
        variant: 'compact',
        size: 'small',
        theme: 'dark',
        showHeader: false,
        showSidebar: false,
        showFooter: false,
        sidebarCollapsed: true,
      };

      fixture.componentRef.setInput('layout', customLayout);
      fixture.detectChanges();

      const element = fixture.nativeElement;
      expect(element.querySelector('.os-dashboard-template--compact')).toBeTruthy();
      expect(element.querySelector('.os-dashboard-template--small')).toBeTruthy();
      expect(element.querySelector('.os-dashboard-template--dark')).toBeTruthy();
    });

    it('should render widgets', () => {
      const widgets: DashboardWidget[] = [
        {
          id: 'widget-1',
          title: 'Budget Summary',
          type: 'budget-summary',
          size: 'medium',
          position: { row: 1, col: 1 },
          data: { variant: 'default', size: 'medium' },
        },
        {
          id: 'widget-2',
          title: 'Goal Progress',
          type: 'goal-progress',
          size: 'large',
          position: { row: 1, col: 2 },
          data: { variant: 'compact', size: 'large' },
        },
      ];

      fixture.componentRef.setInput('widgets', widgets);
      fixture.detectChanges();

      const element = fixture.nativeElement;
      const widgetElements = element.querySelectorAll('.os-dashboard-template__widget');
      expect(widgetElements.length).toBe(2);
    });
  });

  describe('CSS classes', () => {
    it('should have correct dashboard class', () => {
      const layout: DashboardLayout = {
        variant: 'default',
        size: 'medium',
        theme: 'light',
        showHeader: true,
        showSidebar: true,
        showFooter: true,
        sidebarCollapsed: false,
      };

      fixture.componentRef.setInput('layout', layout);
      fixture.detectChanges();

      const dashboardClass = component.dashboardClass();
      expect(dashboardClass).toContain('os-dashboard-template');
      expect(dashboardClass).toContain('os-dashboard-template--default');
      expect(dashboardClass).toContain('os-dashboard-template--medium');
      expect(dashboardClass).toContain('os-dashboard-template--light');
    });

    it('should have correct main class', () => {
      const layout: DashboardLayout = {
        variant: 'default',
        size: 'medium',
        theme: 'light',
        showHeader: true,
        showSidebar: true,
        showFooter: true,
        sidebarCollapsed: false,
      };

      fixture.componentRef.setInput('layout', layout);
      fixture.detectChanges();

      const mainClass = component.mainClass();
      expect(mainClass).toContain('os-dashboard-template__main');
      expect(mainClass).toContain('os-dashboard-template__main--with-sidebar');
    });

    it('should have correct grid class', () => {
      const layout: DashboardLayout = {
        variant: 'default',
        size: 'medium',
        theme: 'light',
        showHeader: true,
        showSidebar: true,
        showFooter: true,
        sidebarCollapsed: false,
      };

      fixture.componentRef.setInput('layout', layout);
      fixture.detectChanges();

      const gridClass = component.gridClass();
      expect(gridClass).toContain('os-dashboard-template__grid');
      expect(gridClass).toContain('os-dashboard-template__grid--default');
      expect(gridClass).toContain('os-dashboard-template__grid--medium');
    });

    it('should have correct widget class', () => {
      const widget: DashboardWidget = {
        id: 'widget-1',
        title: 'Budget Summary',
        type: 'budget-summary',
        size: 'medium',
        position: { row: 1, col: 1 },
      };

      const widgetClass = component.widgetClass(widget);
      expect(widgetClass).toContain('os-dashboard-template__widget');
      expect(widgetClass).toContain('os-dashboard-template__widget--budget-summary');
      expect(widgetClass).toContain('os-dashboard-template__widget--medium');
    });
  });

  describe('computed properties', () => {
    it('should have correct aria label', () => {
      const widgets: DashboardWidget[] = [
        {
          id: '1',
          title: 'Widget 1',
          type: 'budget-summary',
          size: 'medium',
          position: { row: 1, col: 1 },
        },
        {
          id: '2',
          title: 'Widget 2',
          type: 'goal-progress',
          size: 'large',
          position: { row: 1, col: 2 },
          data: {
            title: 'Meta de Viagem',
            description: 'Economizar para viagem',
            currentAmount: 5000,
            targetAmount: 10000,
            deadline: new Date('2024-12-31'),
            status: 'active',
          },
        },
      ];

      fixture.componentRef.setInput('widgets', widgets);
      fixture.detectChanges();

      const ariaLabel = component.ariaLabel();
      expect(ariaLabel).toBe('Dashboard template with 2 widgets');
    });

    it('should have correct header variant', () => {
      const compactLayout: DashboardLayout = {
        variant: 'compact',
        size: 'medium',
        theme: 'light',
        showHeader: true,
        showSidebar: true,
        showFooter: true,
        sidebarCollapsed: false,
      };

      fixture.componentRef.setInput('layout', compactLayout);
      fixture.detectChanges();

      const headerVariant = component.headerVariant();
      expect(headerVariant).toBe('compact');
    });

    it('should have correct sidebar variant', () => {
      const compactLayout: DashboardLayout = {
        variant: 'compact',
        size: 'medium',
        theme: 'light',
        showHeader: true,
        showSidebar: true,
        showFooter: true,
        sidebarCollapsed: false,
      };

      fixture.componentRef.setInput('layout', compactLayout);
      fixture.detectChanges();

      const sidebarVariant = component.sidebarVariant();
      expect(sidebarVariant).toBe('minimal');
    });

    it('should have correct footer variant', () => {
      const compactLayout: DashboardLayout = {
        variant: 'compact',
        size: 'medium',
        theme: 'light',
        showHeader: true,
        showSidebar: true,
        showFooter: true,
        sidebarCollapsed: false,
      };

      fixture.componentRef.setInput('layout', compactLayout);
      fixture.detectChanges();

      const footerVariant = component.footerVariant();
      expect(footerVariant).toBe('minimal');
    });
  });

  describe('event handling', () => {
    it('should emit navigation click event', () => {
      const spy = vi.fn();
      component.navigationClick.subscribe(spy);

      const navigationItem = { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' };
      const mockEvent = new MouseEvent('click');
      component.onNavigationClick({ item: navigationItem, event: mockEvent });
      expect(spy).toHaveBeenCalledWith({ item: 'Dashboard', route: '/dashboard', href: undefined });
    });

    it('should emit user menu click event', () => {
      const spy = vi.fn();
      component.userMenuClick.subscribe(spy);

      const mockEvent = new MouseEvent('click');
      component.onUserMenuClick({
        item: { action: 'profile', label: 'Profile' },
        event: mockEvent,
      });
      expect(spy).toHaveBeenCalledWith({
        action: 'profile',
        user: { name: 'User', email: undefined },
      });
    });

    it('should emit action click event', () => {
      const spy = vi.fn();
      component.actionClick.subscribe(spy);

      const headerAction = { label: 'Refresh', icon: 'refresh', action: 'refresh' };
      const mockEvent = new MouseEvent('click');
      component.onActionClick({ action: headerAction, event: mockEvent });
      expect(spy).toHaveBeenCalledWith({ action: 'Refresh', label: 'Refresh' });
    });

    it('should emit mobile menu toggle event', () => {
      const spy = vi.fn();
      component.mobileMenuToggle.subscribe(spy);

      component.onMobileMenuToggle(true);
      expect(spy).toHaveBeenCalledWith({ open: true });
    });

    it('should emit sidebar navigation click event', () => {
      const spy = vi.fn();
      component.sidebarNavigationClick.subscribe(spy);

      const sidebarItem = { id: 'budgets', label: 'Budgets', route: '/budgets', icon: 'wallet' };
      component.onSidebarNavigationClick(sidebarItem);
      expect(spy).toHaveBeenCalledWith(sidebarItem);
    });

    it('should emit sidebar toggle click event', () => {
      const spy = vi.fn();
      component.sidebarToggleClick.subscribe(spy);

      component.onSidebarToggleClick(true);
      expect(spy).toHaveBeenCalledWith({ collapsed: true });
    });

    it('should emit sidebar header click event', () => {
      const spy = vi.fn();
      component.sidebarHeaderClick.subscribe(spy);

      component.onSidebarHeaderClick({ action: 'logo' });
      expect(spy).toHaveBeenCalledWith({ action: 'logo' });
    });

    it('should emit sidebar footer click event', () => {
      const spy = vi.fn();
      component.sidebarFooterClick.subscribe(spy);

      component.onSidebarFooterClick({ action: 'settings' });
      expect(spy).toHaveBeenCalledWith({ action: 'settings' });
    });

    it('should emit widget click event', () => {
      const spy = vi.fn();
      component.widgetClick.subscribe(spy);

      const mockEvent = new MouseEvent('click');
      const widget = {
        id: 'budget-1',
        title: 'Budget',
        type: 'budget-summary' as const,
        size: 'medium' as const,
        position: { row: 1, col: 1 },
      };

      fixture.componentRef.setInput('widgets', [widget]);
      fixture.detectChanges();

      component.onWidgetClick('budget-summary', mockEvent);
      expect(spy).toHaveBeenCalledWith({
        type: 'budget-summary',
        data: mockEvent,
        widget,
      });
    });

    it('should emit footer link click event', () => {
      const spy = vi.fn();
      component.footerLinkClick.subscribe(spy);

      component.onFooterLinkClick();
      expect(spy).toHaveBeenCalledWith({ label: 'Link', route: undefined, href: undefined });
    });

    it('should emit footer social click event', () => {
      const spy = vi.fn();
      component.footerSocialClick.subscribe(spy);

      component.onFooterSocialClick();
      expect(spy).toHaveBeenCalledWith({ platform: 'social', url: '#' });
    });

    it('should emit empty state action click event', () => {
      const spy = vi.fn();
      component.emptyStateActionClick.subscribe(spy);

      component.onEmptyStateActionClick('create-budget');
      expect(spy).toHaveBeenCalledWith({ action: 'create-budget' });
    });
  });

  describe('accessibility', () => {
    it('should have proper ARIA attributes', () => {
      const layout: DashboardLayout = {
        variant: 'default',
        size: 'medium',
        theme: 'light',
        showHeader: true,
        showSidebar: true,
        showFooter: true,
        sidebarCollapsed: false,
      };

      fixture.componentRef.setInput('layout', layout);
      fixture.detectChanges();

      const element = fixture.nativeElement;
      const dashboardElement = element.querySelector('.os-dashboard-template');
      expect(dashboardElement.getAttribute('aria-label')).toBe('Dashboard template with 0 widgets');
    });

    it('should have proper widget ARIA attributes', () => {
      const widgets: DashboardWidget[] = [
        {
          id: 'widget-1',
          title: 'Budget Summary',
          type: 'budget-summary',
          size: 'medium',
          position: { row: 1, col: 1 },
        },
      ];

      fixture.componentRef.setInput('widgets', widgets);
      fixture.detectChanges();

      const element = fixture.nativeElement;
      const widgetElement = element.querySelector('.os-dashboard-template__widget');
      expect(widgetElement.getAttribute('aria-label')).toBe('Budget Summary');
    });
  });

  describe('responsive behavior', () => {
    it('should handle mobile layout', () => {
      const layout: DashboardLayout = {
        variant: 'default',
        size: 'small',
        theme: 'light',
        showHeader: true,
        showSidebar: true,
        showFooter: true,
        sidebarCollapsed: false,
      };

      fixture.componentRef.setInput('layout', layout);
      fixture.detectChanges();

      const mainClass = component.mainClass();
      expect(mainClass).toContain('os-dashboard-template__main');
    });

    it('should handle compact layout', () => {
      const layout: DashboardLayout = {
        variant: 'compact',
        size: 'small',
        theme: 'light',
        showHeader: true,
        showSidebar: true,
        showFooter: true,
        sidebarCollapsed: false,
      };

      fixture.componentRef.setInput('layout', layout);
      fixture.detectChanges();

      const dashboardClass = component.dashboardClass();
      expect(dashboardClass).toContain('os-dashboard-template--compact');
    });

    it('should handle extended layout', () => {
      const layout: DashboardLayout = {
        variant: 'extended',
        size: 'large',
        theme: 'light',
        showHeader: true,
        showSidebar: true,
        showFooter: true,
        sidebarCollapsed: false,
      };

      fixture.componentRef.setInput('layout', layout);
      fixture.detectChanges();

      const dashboardClass = component.dashboardClass();
      expect(dashboardClass).toContain('os-dashboard-template--extended');
    });
  });

  describe('loading and empty states', () => {
    it('should show loading state when loading is true', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      const element = fixture.nativeElement;
      expect(element.querySelector('.os-dashboard-template__loading')).toBeTruthy();
      expect(element.querySelector('.os-dashboard-template__spinner')).toBeTruthy();
    });

    it('should show empty state when no widgets and emptyState is provided', () => {
      fixture.componentRef.setInput('widgets', []);
      fixture.componentRef.setInput('emptyState', {
        message: 'No widgets available',
        action: { label: 'Create Widget', action: 'create' },
      });
      fixture.detectChanges();

      const element = fixture.nativeElement;
      expect(element.querySelector('.os-dashboard-template__empty')).toBeTruthy();
      expect(element.querySelector('.os-dashboard-template__empty-icon')).toBeTruthy();
      expect(element.querySelector('.os-dashboard-template__empty-action')).toBeTruthy();
    });

    it('should show widgets when not loading and widgets are available', () => {
      const widgets: DashboardWidget[] = [
        {
          id: '1',
          title: 'Test Widget',
          type: 'budget-summary',
          size: 'medium',
          position: { row: 1, col: 1 },
        },
      ];
      fixture.componentRef.setInput('loading', false);
      fixture.componentRef.setInput('widgets', widgets);
      fixture.detectChanges();

      const element = fixture.nativeElement;
      expect(element.querySelector('.os-dashboard-template__loading')).toBeFalsy();
      expect(element.querySelector('.os-dashboard-template__empty')).toBeFalsy();
      expect(element.querySelector('.os-dashboard-template__grid')).toBeTruthy();
    });
  });
});
