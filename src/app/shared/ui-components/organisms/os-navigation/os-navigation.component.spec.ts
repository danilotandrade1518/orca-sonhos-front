import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import {
  OsNavigationComponent,
  NavigationItem,
  NavigationVariant,
  NavigationSize,
  NavigationOrientation,
} from './os-navigation.component';
import { OsNavigationItemComponent } from '../../molecules/os-navigation-item/os-navigation-item.component';

describe('OsNavigationComponent', () => {
  let component: OsNavigationComponent;
  let fixture: ComponentFixture<OsNavigationComponent>;

  const mockItems: NavigationItem[] = [
    {
      id: 'home',
      label: 'Início',
      icon: 'home',
      route: '/home',
    },
    {
      id: 'budgets',
      label: 'Orçamentos',
      icon: 'account_balance_wallet',
      route: '/budgets',
      badge: '3',
    },
    {
      id: 'reports',
      label: 'Relatórios',
      icon: 'analytics',
      route: '/reports',
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
      imports: [OsNavigationComponent, OsNavigationItemComponent, RouterTestingModule],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(OsNavigationComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('items', mockItems);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Input Properties', () => {
    it('should set default values', () => {
      expect(component.variant()()).toBe('default');
      expect(component.size()()).toBe('medium');
      expect(component.orientation()()).toBe('horizontal');
      expect(component.activeItemId()()).toBeNull();
      expect(component.ariaLabel()).toBe('Navegação principal');
      expect(component.showCustomContent()()).toBe(false);
    });

    it('should accept custom items', () => {
      const customItems: NavigationItem[] = [{ id: 'test', label: 'Test', route: '/test' }];
      fixture.componentRef.setInput('items', customItems);
      fixture.detectChanges();

      expect(component.items()).toEqual(customItems);
    });

    it('should accept custom variant', () => {
      component.variant().set('sidebar');
      fixture.detectChanges();

      expect(component.variant()()).toBe('sidebar');
    });

    it('should accept custom size', () => {
      component.size().set('large');
      fixture.detectChanges();

      expect(component.size()()).toBe('large');
    });

    it('should accept custom orientation', () => {
      component.orientation().set('vertical');
      fixture.detectChanges();

      expect(component.orientation()()).toBe('vertical');
    });

    it('should accept active item id', () => {
      component.activeItemId().set('home');
      fixture.detectChanges();

      expect(component.activeItemId()()).toBe('home');
    });
  });

  describe('Computed Properties', () => {
    it('should generate correct navigation classes', () => {
      component.variant().set('tabs');
      component.size().set('large');
      component.orientation().set('vertical');
      fixture.detectChanges();

      const classes = component.navigationClasses();
      expect(classes).toContain('os-navigation');
      expect(classes).toContain('os-navigation--tabs');
      expect(classes).toContain('os-navigation--large');
      expect(classes).toContain('os-navigation--vertical');
    });

    it('should generate correct list classes', () => {
      component.variant().set('sidebar');
      component.orientation().set('vertical');
      fixture.detectChanges();

      const classes = component.listClasses();
      expect(classes).toContain('os-navigation__list');
      expect(classes).toContain('os-navigation__list--vertical');
      expect(classes).toContain('os-navigation__list--sidebar');
    });

    it('should map variant to item variant', () => {
      const variantMap: Record<NavigationVariant, string> = {
        default: 'default',
        minimal: 'secondary',
        sidebar: 'primary',
        tabs: 'accent',
      };

      Object.entries(variantMap).forEach(([variant, expected]) => {
        component.variant().set(variant as NavigationVariant);
        fixture.detectChanges();
        expect(component.itemVariant()).toBe(expected);
      });
    });

    it('should map size to item size', () => {
      const sizeMap: Record<NavigationSize, string> = {
        small: 'small',
        medium: 'medium',
        large: 'large',
      };

      Object.entries(sizeMap).forEach(([size, expected]) => {
        component.size().set(size as NavigationSize);
        fixture.detectChanges();
        expect(component.itemSize()).toBe(expected);
      });
    });
  });

  describe('Active Item Detection', () => {
    it('should identify active item correctly', () => {
      component.activeItemId().set('budgets');
      fixture.detectChanges();

      const budgetsItem = mockItems[1];
      const homeItem = mockItems[0];

      expect(component.isActiveItem(budgetsItem)).toBe(true);
      expect(component.isActiveItem(homeItem)).toBe(false);
    });

    it('should return false when no active item is set', () => {
      component.activeItemId().set(null);
      fixture.detectChanges();

      const homeItem = mockItems[0];
      expect(component.isActiveItem(homeItem)).toBe(false);
    });
  });

  describe('Event Handling', () => {
    it('should handle item click without errors', () => {
      const homeItem = mockItems[0];
      expect(() => component.onItemClick(homeItem)).not.toThrow();
    });

    it('should handle disabled item click without errors', () => {
      const disabledItem = mockItems[3];
      expect(() => component.onItemClick(disabledItem)).not.toThrow();
    });

    it('should handle navigate event without errors', () => {
      const event = {
        item: mockItems[0],
        route: '/home',
        href: undefined,
      };
      expect(() => component.onNavigate(event)).not.toThrow();
    });
  });

  describe('Template Rendering', () => {
    it('should render navigation element with correct attributes', () => {
      const navElement = fixture.nativeElement.querySelector('nav');
      expect(navElement).toBeTruthy();
      expect(navElement.getAttribute('aria-label')).toBe('Navegação principal');
      expect(navElement.getAttribute('role')).toBe('navigation');
    });

    it('should render list element with correct attributes', () => {
      const listElement = fixture.nativeElement.querySelector('ul');
      expect(listElement).toBeTruthy();
      expect(listElement.getAttribute('role')).toBe('list');
    });

    it('should render navigation items', () => {
      const navigationItems = fixture.nativeElement.querySelectorAll('os-navigation-item');
      expect(navigationItems.length).toBe(mockItems.length);
    });

    it('should not render custom content by default', () => {
      const customContent = fixture.nativeElement.querySelector('.os-navigation__custom');
      expect(customContent).toBeFalsy();
    });

    it('should render custom content when enabled', () => {
      component.showCustomContent().set(true);
      fixture.detectChanges();

      const customContent = fixture.nativeElement.querySelector('.os-navigation__custom');
      expect(customContent).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      const navElement = fixture.nativeElement.querySelector('nav');
      expect(navElement.getAttribute('aria-label')).toBe('Navegação principal');
      expect(navElement.getAttribute('role')).toBe('navigation');
    });

    it('should have proper list structure', () => {
      const listElement = fixture.nativeElement.querySelector('ul');
      const listItems = fixture.nativeElement.querySelectorAll('li');

      expect(listElement.getAttribute('role')).toBe('list');
      expect(listItems.length).toBe(mockItems.length);

      listItems.forEach((li: HTMLElement) => {
        expect(li.getAttribute('role')).toBe('none');
      });
    });
  });

  describe('Responsive Behavior', () => {
    it('should apply correct classes for different variants', () => {
      const variants: NavigationVariant[] = ['default', 'minimal', 'sidebar', 'tabs'];

      variants.forEach((variant) => {
        component.variant().set(variant);
        fixture.detectChanges();

        const navElement = fixture.nativeElement.querySelector('nav');
        expect(navElement.classList.contains(`os-navigation--${variant}`)).toBe(true);
      });
    });

    it('should apply correct classes for different sizes', () => {
      const sizes: NavigationSize[] = ['small', 'medium', 'large'];

      sizes.forEach((size) => {
        component.size().set(size);
        fixture.detectChanges();

        const navElement = fixture.nativeElement.querySelector('nav');
        expect(navElement.classList.contains(`os-navigation--${size}`)).toBe(true);
      });
    });

    it('should apply correct classes for different orientations', () => {
      const orientations: NavigationOrientation[] = ['horizontal', 'vertical'];

      orientations.forEach((orientation) => {
        component.orientation().set(orientation);
        fixture.detectChanges();

        const navElement = fixture.nativeElement.querySelector('nav');
        expect(navElement.classList.contains(`os-navigation--${orientation}`)).toBe(true);
      });
    });
  });

  describe('Integration with Navigation Items', () => {
    it('should render navigation items correctly', () => {
      component.variant().set('sidebar');
      component.size().set('large');
      component.orientation().set('vertical');
      component.activeItemId().set('home');
      fixture.detectChanges();

      const navigationItems = fixture.nativeElement.querySelectorAll('os-navigation-item');
      expect(navigationItems.length).toBe(mockItems.length);
      expect(navigationItems[0]).toBeTruthy();
    });
  });
});
