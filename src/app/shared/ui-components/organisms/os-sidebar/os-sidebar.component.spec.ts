import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import {
  OsSidebarComponent,
  SidebarItem,
  SidebarVariant,
  SidebarSize,
  SidebarTheme,
} from './os-sidebar.component';

describe('OsSidebarComponent', () => {
  let component: OsSidebarComponent;
  let fixture: ComponentFixture<OsSidebarComponent>;

  const mockItems: SidebarItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/dashboard',
    },
    {
      id: 'budgets',
      label: 'Orçamentos',
      icon: 'wallet',
      route: '/budgets',
      children: [
        {
          id: 'budgets-list',
          label: 'Lista',
          route: '/budgets/list',
        },
        {
          id: 'budgets-create',
          label: 'Criar',
          route: '/budgets/create',
        },
      ],
    },
    {
      id: 'transactions',
      label: 'Transações',
      icon: 'credit-card',
      route: '/transactions',
      badge: 5,
    },
    {
      id: 'settings',
      label: 'Configurações',
      icon: 'settings',
      route: '/settings',
      disabled: true,
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OsSidebarComponent, RouterTestingModule],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(OsSidebarComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('items', mockItems);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Input Properties', () => {
    it('should set default values', () => {
      expect(component.variant()).toBe('default');
      expect(component.size()).toBe('medium');
      expect(component.theme()).toBe('light');
      expect(component.collapsed()).toBe(false);
      expect(component.ariaLabel()).toBe('Navegação lateral');
      expect(component.logoAlt()).toBe('Logo');
      expect(component.showHeader()).toBe(true);
      expect(component.showFooter()).toBe(false);
      expect(component.showToggleButton()).toBe(true);
      expect(component.showCustomContent()).toBe(false);
    });

    it('should accept custom inputs', () => {
      fixture.componentRef.setInput('variant', 'minimal');
      fixture.componentRef.setInput('size', 'large');
      fixture.componentRef.setInput('theme', 'dark');
      fixture.componentRef.setInput('collapsed', true);
      fixture.componentRef.setInput('title', 'My App');
      fixture.componentRef.setInput('logo', '/assets/logo.png');
      fixture.componentRef.setInput('ariaLabel', 'Custom navigation');
      fixture.componentRef.setInput('logoAlt', 'Custom logo');
      fixture.componentRef.setInput('showHeader', false);
      fixture.componentRef.setInput('showFooter', true);
      fixture.componentRef.setInput('showToggleButton', false);
      fixture.componentRef.setInput('showCustomContent', true);

      expect(component.variant()).toBe('minimal');
      expect(component.size()).toBe('large');
      expect(component.theme()).toBe('dark');
      expect(component.collapsed()).toBe(true);
      expect(component.title()).toBe('My App');
      expect(component.logo()).toBe('/assets/logo.png');
      expect(component.ariaLabel()).toBe('Custom navigation');
      expect(component.logoAlt()).toBe('Custom logo');
      expect(component.showHeader()).toBe(false);
      expect(component.showFooter()).toBe(true);
      expect(component.showToggleButton()).toBe(false);
      expect(component.showCustomContent()).toBe(true);
    });
  });

  describe('CSS Classes', () => {
    it('should apply base classes', () => {
      const classes = component.sidebarClasses();
      expect(classes).toContain('os-sidebar');
      expect(classes).toContain('os-sidebar--default');
      expect(classes).toContain('os-sidebar--medium');
      expect(classes).toContain('os-sidebar--light');
    });

    it('should apply variant classes', () => {
      const variants: SidebarVariant[] = ['default', 'minimal', 'compact', 'expanded'];

      variants.forEach((variant) => {
        fixture.componentRef.setInput('variant', variant);
        const classes = component.sidebarClasses();
        expect(classes).toContain(`os-sidebar--${variant}`);
      });
    });

    it('should apply size classes', () => {
      const sizes: SidebarSize[] = ['small', 'medium', 'large'];

      sizes.forEach((size) => {
        fixture.componentRef.setInput('size', size);
        const classes = component.sidebarClasses();
        expect(classes).toContain(`os-sidebar--${size}`);
      });
    });

    it('should apply theme classes', () => {
      const themes: SidebarTheme[] = ['light', 'dark'];

      themes.forEach((theme) => {
        fixture.componentRef.setInput('theme', theme);
        const classes = component.sidebarClasses();
        expect(classes).toContain(`os-sidebar--${theme}`);
      });
    });

    it('should apply collapsed class when collapsed', () => {
      fixture.componentRef.setInput('collapsed', true);
      const classes = component.sidebarClasses();
      expect(classes).toContain('os-sidebar--collapsed');
    });

    it('should not apply collapsed class when expanded', () => {
      fixture.componentRef.setInput('collapsed', false);
      const classes = component.sidebarClasses();
      expect(classes).not.toContain('os-sidebar--collapsed');
    });
  });

  describe('Item Variants and Sizes', () => {
    it('should map variants correctly for main items', () => {
      const variantMap = {
        default: 'primary',
        minimal: 'secondary',
        compact: 'default',
        expanded: 'primary',
      };

      Object.entries(variantMap).forEach(([sidebarVariant, expectedItemVariant]) => {
        fixture.componentRef.setInput('variant', sidebarVariant as SidebarVariant);
        expect(component.itemVariant()).toBe(expectedItemVariant);
      });
    });

    it('should map variants correctly for sub-items', () => {
      const variantMap = {
        default: 'secondary',
        minimal: 'secondary',
        compact: 'secondary',
        expanded: 'secondary',
      };

      Object.entries(variantMap).forEach(([sidebarVariant, expectedItemVariant]) => {
        fixture.componentRef.setInput('variant', sidebarVariant as SidebarVariant);
        expect(component.subItemVariant()).toBe(expectedItemVariant);
      });
    });

    it('should map sizes correctly for main items', () => {
      const sizeMap = {
        small: 'small',
        medium: 'medium',
        large: 'large',
      };

      Object.entries(sizeMap).forEach(([sidebarSize, expectedItemSize]) => {
        fixture.componentRef.setInput('size', sidebarSize as SidebarSize);
        expect(component.itemSize()).toBe(expectedItemSize);
      });
    });

    it('should map sizes correctly for sub-items', () => {
      const sizeMap = {
        small: 'small',
        medium: 'small',
        large: 'medium',
      };

      Object.entries(sizeMap).forEach(([sidebarSize, expectedItemSize]) => {
        fixture.componentRef.setInput('size', sidebarSize as SidebarSize);
        expect(component.subItemSize()).toBe(expectedItemSize);
      });
    });
  });

  describe('Active Item Detection', () => {
    it('should detect active item by id', () => {
      fixture.componentRef.setInput('activeItemId', 'budgets');

      const budgetsItem = mockItems.find((item) => item.id === 'budgets');
      const dashboardItem = mockItems.find((item) => item.id === 'dashboard');

      expect(component.isActiveItem(budgetsItem!)).toBe(true);
      expect(component.isActiveItem(dashboardItem!)).toBe(false);
    });

    it('should return false when no active item is set', () => {
      fixture.componentRef.setInput('activeItemId', null);

      const budgetsItem = mockItems.find((item) => item.id === 'budgets');
      expect(component.isActiveItem(budgetsItem!)).toBe(false);
    });
  });

  describe('Item Click Handling', () => {
    it('should emit itemClick event when item is clicked', () => {
      let emittedItem: SidebarItem | undefined;
      component.itemClick.subscribe((item) => (emittedItem = item));

      const item = mockItems[0];
      component.onItemClick(item);

      expect(emittedItem).toBe(item);
    });

    it('should not emit itemClick when item is disabled', () => {
      let emittedItem: SidebarItem | undefined;
      component.itemClick.subscribe((item) => (emittedItem = item));

      const disabledItem = mockItems.find((item) => item.disabled);
      component.onItemClick(disabledItem!);

      expect(emittedItem).toBeUndefined();
    });

    it('should emit navigate event when item has route', () => {
      let emittedEvent: { item: SidebarItem; route?: string; href?: string } | undefined;
      component.navigate.subscribe((event) => (emittedEvent = event));

      const itemWithRoute = mockItems.find((item) => item.route);
      if (itemWithRoute) {
        component.onItemClick(itemWithRoute);
      }

      expect(emittedEvent).toEqual({
        item: itemWithRoute!,
        route: itemWithRoute!.route,
        href: undefined,
      });
    });

    it('should emit navigate event when item has href', () => {
      let emittedEvent: { item: SidebarItem; route?: string; href?: string } | undefined;
      component.navigate.subscribe((event) => (emittedEvent = event));

      const itemWithHref: SidebarItem = {
        id: 'external',
        label: 'External',
        href: 'https://example.com',
      };
      component.onItemClick(itemWithHref);

      expect(emittedEvent).toEqual({
        item: itemWithHref,
        route: undefined,
        href: 'https://example.com',
      });
    });
  });

  describe('Collapse Functionality', () => {
    it('should emit collapseChange event when toggling', () => {
      let emittedValues: boolean[] = [];
      component.collapseChange.subscribe((value) => emittedValues.push(value));

      component.toggleCollapse();
      expect(emittedValues[0]).toBe(true);

      component.toggleCollapse();
      expect(emittedValues[1]).toBe(true);
    });

    it('should reflect collapsed state from input', () => {
      fixture.componentRef.setInput('collapsed', true);
      expect(component.isCollapsed()).toBe(true);

      fixture.componentRef.setInput('collapsed', false);
      expect(component.isCollapsed()).toBe(false);
    });
  });

  describe('Navigation Handling', () => {
    it('should emit navigate event', () => {
      let emittedEvent: { item: SidebarItem; route?: string; href?: string } | undefined;
      component.navigate.subscribe((event) => (emittedEvent = event));

      const event = {
        item: mockItems[0],
        route: '/dashboard',
        href: undefined,
      };
      component.onNavigate(event);

      expect(emittedEvent).toEqual(event);
    });
  });

  describe('Template Rendering', () => {
    it('should render header when showHeader is true', () => {
      fixture.componentRef.setInput('showHeader', true);
      fixture.componentRef.setInput('title', 'Test App');
      fixture.detectChanges();

      const header = fixture.nativeElement.querySelector('.os-sidebar__header');
      expect(header).toBeTruthy();
    });

    it('should not render header when showHeader is false', () => {
      fixture.componentRef.setInput('showHeader', false);
      fixture.detectChanges();

      const header = fixture.nativeElement.querySelector('.os-sidebar__header');
      expect(header).toBeFalsy();
    });

    it('should render title when provided', () => {
      fixture.componentRef.setInput('title', 'My Application');
      fixture.detectChanges();

      const title = fixture.nativeElement.querySelector('.os-sidebar__title');
      expect(title).toBeTruthy();
      expect(title.textContent).toBe('My Application');
    });

    it('should render logo when provided', () => {
      fixture.componentRef.setInput('logo', '/assets/logo.png');
      fixture.detectChanges();

      const logo = fixture.nativeElement.querySelector('.os-sidebar__logo-image');
      expect(logo).toBeTruthy();
      expect(logo.src).toContain('/assets/logo.png');
    });

    it('should render toggle button when showToggleButton is true', () => {
      fixture.componentRef.setInput('showToggleButton', true);
      fixture.detectChanges();

      const toggleButton = fixture.nativeElement.querySelector('.os-sidebar__toggle');
      expect(toggleButton).toBeTruthy();
    });

    it('should not render toggle button when showToggleButton is false', () => {
      fixture.componentRef.setInput('showToggleButton', false);
      fixture.detectChanges();

      const toggleButton = fixture.nativeElement.querySelector('.os-sidebar__toggle');
      expect(toggleButton).toBeFalsy();
    });

    it('should render footer when showFooter is true', () => {
      fixture.componentRef.setInput('showFooter', true);
      fixture.detectChanges();

      const footer = fixture.nativeElement.querySelector('.os-sidebar__footer');
      expect(footer).toBeTruthy();
    });

    it('should not render footer when showFooter is false', () => {
      fixture.componentRef.setInput('showFooter', false);
      fixture.detectChanges();

      const footer = fixture.nativeElement.querySelector('.os-sidebar__footer');
      expect(footer).toBeFalsy();
    });

    it('should render custom content when showCustomContent is true', () => {
      fixture.componentRef.setInput('showCustomContent', true);
      fixture.detectChanges();

      const customContent = fixture.nativeElement.querySelector('.os-sidebar__custom');
      expect(customContent).toBeTruthy();
    });

    it('should not render custom content when showCustomContent is false', () => {
      fixture.componentRef.setInput('showCustomContent', false);
      fixture.detectChanges();

      const customContent = fixture.nativeElement.querySelector('.os-sidebar__custom');
      expect(customContent).toBeFalsy();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      const sidebar = fixture.nativeElement.querySelector('aside');
      expect(sidebar.getAttribute('aria-label')).toBe('Navegação lateral');
      expect(sidebar.getAttribute('role')).toBe('complementary');
    });

    it('should have proper navigation role', () => {
      const nav = fixture.nativeElement.querySelector('.os-sidebar__nav');
      expect(nav.getAttribute('role')).toBe('navigation');
    });

    it('should have proper list roles', () => {
      const lists = fixture.nativeElement.querySelectorAll('[role="list"]');
      expect(lists.length).toBeGreaterThan(0);
    });

    it('should have proper list item roles', () => {
      const listItems = fixture.nativeElement.querySelectorAll('[role="none"]');
      expect(listItems.length).toBeGreaterThan(0);
    });

    it('should have proper toggle button ARIA attributes', () => {
      fixture.componentRef.setInput('showToggleButton', true);
      fixture.detectChanges();

      const toggleButton = fixture.nativeElement.querySelector('.os-sidebar__toggle');
      expect(toggleButton.getAttribute('aria-label')).toBe('Colapsar sidebar');
      expect(toggleButton.getAttribute('aria-expanded')).toBe('true');
    });

    it('should update toggle button ARIA attributes when collapsed', () => {
      fixture.componentRef.setInput('showToggleButton', true);
      fixture.componentRef.setInput('collapsed', true);
      fixture.detectChanges();

      const toggleButton = fixture.nativeElement.querySelector('.os-sidebar__toggle');
      expect(toggleButton.getAttribute('aria-label')).toBe('Expandir sidebar');
      expect(toggleButton.getAttribute('aria-expanded')).toBe('false');
    });
  });

  describe('Responsive Behavior', () => {
    it('should handle different screen sizes', () => {
      // Test that component doesn't break with different configurations
      fixture.componentRef.setInput('size', 'small');
      fixture.componentRef.setInput('variant', 'compact');
      fixture.detectChanges();

      expect(component).toBeTruthy();
    });
  });
});
