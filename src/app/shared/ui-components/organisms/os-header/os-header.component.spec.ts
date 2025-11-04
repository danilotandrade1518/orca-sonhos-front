import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';
import { OsHeaderComponent, HeaderUserMenu, HeaderAction } from './os-header.component';
import { OsButtonComponent } from '../../atoms/os-button/os-button.component';
import { OsAvatarComponent } from '../../atoms/os-avatar/os-avatar.component';
import { OsNavigationItemComponent } from '../../molecules/os-navigation-item/os-navigation-item.component';
import { OsIconComponent } from '../../atoms/os-icon/os-icon.component';

describe('OsHeaderComponent', () => {
  let component: OsHeaderComponent;
  let fixture: ComponentFixture<OsHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        OsHeaderComponent,
        RouterTestingModule,
        OsButtonComponent,
        OsAvatarComponent,
        OsNavigationItemComponent,
        OsIconComponent,
      ],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(OsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Logo/Brand Section', () => {
    it('should have logoClick output available', () => {
      expect(component.logoClick).toBeDefined();
    });
  });

  describe('Navigation Section', () => {
    it('should have navigationClick output available', () => {
      expect(component.navigationClick).toBeDefined();
    });

    it('should have mobileNavigationClick output available', () => {
      expect(component.mobileNavigationClick).toBeDefined();
    });
  });

  describe('User Menu Section', () => {
    const mockUserMenuItems: HeaderUserMenu[] = [
      { label: 'Profile', icon: 'user', route: '/profile' },
      { label: 'Settings', icon: 'settings', route: '/settings' },
      { label: 'Logout', icon: 'logout', action: 'logout' },
    ];

    beforeEach(() => {
      fixture.componentRef.setInput('showUserMenu', true);
      fixture.componentRef.setInput('userName', 'John Doe');
      fixture.componentRef.setInput('userRole', 'Admin');
      fixture.componentRef.setInput('userAvatar', '/assets/avatar.jpg');
      fixture.componentRef.setInput('userMenuItems', mockUserMenuItems);
      fixture.detectChanges();
    });

    it('should render user menu when showUserMenu is true', () => {
      const userMenu = fixture.debugElement.query(By.css('.os-header__user-menu'));
      expect(userMenu).toBeTruthy();
    });

    it('should render user avatar with correct props', () => {
      const avatar = fixture.debugElement.query(By.directive(OsAvatarComponent));
      expect(avatar).toBeTruthy();
      expect(avatar.componentInstance.image()).toBe('/assets/avatar.jpg');
      expect(avatar.componentInstance.ariaLabel()).toBe('John Doe');
    });

    it('should render user info when variant is extended', () => {
      fixture.componentRef.setInput('variant', 'extended');
      fixture.detectChanges();

      const userInfo = fixture.debugElement.query(By.css('.os-header__user-info'));
      expect(userInfo).toBeTruthy();

      const userName = fixture.debugElement.query(By.css('.os-header__user-name'));
      expect(userName.nativeElement.textContent.trim()).toBe('John Doe');

      const userRole = fixture.debugElement.query(By.css('.os-header__user-role'));
      expect(userRole.nativeElement.textContent.trim()).toBe('Admin');
    });

    it('should toggle user menu when user trigger is clicked', () => {
      const userTrigger = fixture.debugElement.query(By.css('.os-header__user-trigger'));
      expect(component.userMenuOpen()).toBe(false);

      userTrigger.nativeElement.click();
      expect(component.userMenuOpen()).toBe(true);

      userTrigger.nativeElement.click();
      expect(component.userMenuOpen()).toBe(false);
    });

    it('should render user dropdown when menu is open', () => {
      component.userMenuOpen.set(true);
      fixture.detectChanges();

      const dropdown = fixture.debugElement.query(By.css('.os-header__user-dropdown'));
      expect(dropdown).toBeTruthy();

      const menuItems = fixture.debugElement.queryAll(By.css('.os-header__user-menu-item'));
      expect(menuItems.length).toBe(3);
    });

    it('should emit userMenuItemClick when menu item is clicked', () => {
      const spy = vi.fn();
      component.userMenuItemClick.subscribe(spy);
      component.userMenuOpen.set(true);
      fixture.detectChanges();

      const menuItems = fixture.debugElement.queryAll(By.css('.os-header__user-menu-item'));
      menuItems[0].nativeElement.click();

      expect(spy).toHaveBeenCalled();
    });

    it('should close menu after clicking menu item', () => {
      component.userMenuOpen.set(true);
      fixture.detectChanges();

      const menuItems = fixture.debugElement.queryAll(By.css('.os-header__user-menu-item'));
      menuItems[0].nativeElement.click();

      expect(component.userMenuOpen()).toBe(false);
    });

    it('should not open menu when userMenuDisabled is true', () => {
      fixture.componentRef.setInput('userMenuDisabled', true);
      fixture.detectChanges();

      const userTrigger = fixture.debugElement.query(By.css('.os-header__user-trigger'));
      userTrigger.nativeElement.click();

      expect(component.userMenuOpen()).toBe(false);
    });
  });

  describe('Actions Section', () => {
    const mockActions: HeaderAction[] = [
      { label: 'Create', icon: 'plus', variant: 'primary' },
      { label: 'Import', icon: 'upload', variant: 'secondary' },
      { label: 'Export', icon: 'download', variant: 'tertiary' },
    ];

    it('should render action buttons when provided', () => {
      fixture.componentRef.setInput('actions', mockActions);
      fixture.detectChanges();

      const actionButtons = fixture.debugElement.queryAll(By.directive(OsButtonComponent));
      expect(actionButtons.length).toBe(3);
    });

    it('should pass correct props to action buttons', () => {
      fixture.componentRef.setInput('actions', mockActions);
      fixture.detectChanges();

      const actionButtons = fixture.debugElement.queryAll(By.directive(OsButtonComponent));
      const firstButton = actionButtons[0].componentInstance;

      expect(firstButton.variant()).toBe('primary');
      expect(firstButton.icon()).toBe('plus');
    });

    it('should emit actionClick when action button is clicked', () => {
      const spy = vi.fn();
      component.actionClick.subscribe(spy);
      fixture.componentRef.setInput('actions', mockActions);
      fixture.detectChanges();

      const actionButtons = fixture.debugElement.queryAll(By.directive(OsButtonComponent));
      actionButtons[0].triggerEventHandler('buttonClick', new MouseEvent('click'));

      expect(spy).toHaveBeenCalled();
    });

    it('should not render actions when no actions provided', () => {
      fixture.componentRef.setInput('actions', []);
      fixture.detectChanges();

      const actionButtons = fixture.debugElement.query(By.css('.os-header__action-buttons'));
      expect(actionButtons).toBeFalsy();
    });
  });

  describe('Mobile Menu Section', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('showMobileMenu', true);
      fixture.detectChanges();
    });

    it('should render mobile toggle when showMobileMenu is true', () => {
      const mobileToggle = fixture.debugElement.query(By.css('.os-header__mobile-toggle'));
      expect(mobileToggle).toBeTruthy();
    });

    it('should toggle mobile menu when toggle is clicked', () => {
      const mobileToggle = fixture.debugElement.query(By.css('.os-header__mobile-toggle'));
      expect(component.mobileMenuOpen()).toBe(false);

      mobileToggle.nativeElement.click();
      expect(component.mobileMenuOpen()).toBe(true);

      mobileToggle.nativeElement.click();
      expect(component.mobileMenuOpen()).toBe(false);
    });

    it('should emit mobileMenuToggle when mobile menu is toggled', () => {
      const spy = vi.fn();
      component.mobileMenuToggle.subscribe(spy);
      const mobileToggle = fixture.debugElement.query(By.css('.os-header__mobile-toggle'));

      mobileToggle.nativeElement.click();
      expect(spy).toHaveBeenCalledWith(true);

      mobileToggle.nativeElement.click();
      expect(spy).toHaveBeenCalledWith(false);
    });

    it('should have mobileNavigationClick output available', () => {
      expect(component.mobileNavigationClick).toBeDefined();
    });

    it('should have mobileNavigationClasses computed', () => {
      expect(component.mobileNavigationClasses).toBeDefined();
      expect(typeof component.mobileNavigationClasses).toBe('function');
    });
  });

  describe('Styling and Variants', () => {
    it('should apply correct CSS classes for variant', () => {
      fixture.componentRef.setInput('variant', 'compact');
      fixture.detectChanges();

      const header = fixture.debugElement.query(By.css('.os-header'));
      expect(header.nativeElement.classList.contains('os-header--compact')).toBe(true);
    });

    it('should apply correct CSS classes for size', () => {
      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();

      const header = fixture.debugElement.query(By.css('.os-header'));
      expect(header.nativeElement.classList.contains('os-header--large')).toBe(true);
    });

    it('should apply correct CSS classes for theme', () => {
      fixture.componentRef.setInput('theme', 'dark');
      fixture.detectChanges();

      const header = fixture.debugElement.query(By.css('.os-header'));
      expect(header.nativeElement.classList.contains('os-header--dark')).toBe(true);
    });

    it('should apply sticky class when sticky is true', () => {
      fixture.componentRef.setInput('sticky', true);
      fixture.detectChanges();

      const header = fixture.debugElement.query(By.css('.os-header'));
      expect(header.nativeElement.classList.contains('os-header--sticky')).toBe(true);
    });

    it('should apply mobile open class when mobile menu is open', () => {
      fixture.componentRef.setInput('showMobileMenu', true);
      component.mobileMenuOpen.set(true);
      fixture.detectChanges();

      const header = fixture.debugElement.query(By.css('.os-header'));
      expect(header.nativeElement.classList.contains('os-header--mobile-open')).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('should have correct aria-label for header', () => {
      fixture.componentRef.setInput('ariaLabel', 'Main header');
      fixture.detectChanges();

      const header = fixture.debugElement.query(By.css('.os-header'));
      expect(header.attributes['aria-label']).toBe('Main header');
    });

    it('should have navigationClick output for navigation handling', () => {
      expect(component.navigationClick).toBeDefined();
    });

    it('should have correct aria-label for user menu', () => {
      fixture.componentRef.setInput('showUserMenu', true);
      fixture.componentRef.setInput('userMenuAriaLabel', 'User account menu');
      fixture.detectChanges();

      const userTrigger = fixture.debugElement.query(By.css('.os-header__user-trigger'));
      expect(userTrigger.attributes['aria-label']).toBe('User account menu');
    });

    it('should have correct aria-expanded for user menu', () => {
      fixture.componentRef.setInput('showUserMenu', true);
      fixture.detectChanges();

      const userTrigger = fixture.debugElement.query(By.css('.os-header__user-trigger'));
      expect(userTrigger.attributes['aria-expanded']).toBe('false');

      component.userMenuOpen.set(true);
      fixture.detectChanges();
      expect(userTrigger.attributes['aria-expanded']).toBe('true');
    });

    it('should have correct aria-expanded for mobile menu', () => {
      fixture.componentRef.setInput('showMobileMenu', true);
      fixture.detectChanges();

      const mobileToggle = fixture.debugElement.query(By.css('.os-header__mobile-toggle'));
      expect(mobileToggle.attributes['aria-expanded']).toBe('false');

      component.mobileMenuOpen.set(true);
      fixture.detectChanges();
      expect(mobileToggle.attributes['aria-expanded']).toBe('true');
    });

    it('should have correct role for user dropdown', () => {
      fixture.componentRef.setInput('showUserMenu', true);
      component.userMenuOpen.set(true);
      fixture.detectChanges();

      const dropdown = fixture.debugElement.query(By.css('.os-header__user-dropdown'));
      expect(dropdown.attributes['role']).toBe('menu');
    });

    it('should have mobileNavigationClick output for mobile navigation handling', () => {
      expect(component.mobileNavigationClick).toBeDefined();
    });
  });

  describe('Computed Properties', () => {
    it('should compute header classes correctly', () => {
      fixture.componentRef.setInput('variant', 'compact');
      fixture.componentRef.setInput('size', 'large');
      fixture.componentRef.setInput('theme', 'dark');
      fixture.detectChanges();

      const headerClasses = component.headerClasses();
      expect(headerClasses).toContain('os-header');
      expect(headerClasses).toContain('os-header--compact');
      expect(headerClasses).toContain('os-header--large');
      expect(headerClasses).toContain('os-header--dark');
    });

    it('should compute user trigger classes correctly', () => {
      fixture.componentRef.setInput('showUserMenu', true);
      fixture.detectChanges();

      let userTriggerClasses = component.userTriggerClasses();
      expect(userTriggerClasses).toContain('os-header__user-trigger');
      expect(userTriggerClasses).not.toContain('os-header__user-trigger--open');

      component.userMenuOpen.set(true);
      fixture.detectChanges();
      userTriggerClasses = component.userTriggerClasses();
      expect(userTriggerClasses).toContain('os-header__user-trigger--open');
    });

    it('should compute mobile toggle classes correctly', () => {
      fixture.componentRef.setInput('showMobileMenu', true);
      fixture.detectChanges();

      let mobileToggleClasses = component.mobileToggleClasses();
      expect(mobileToggleClasses).toContain('os-header__mobile-toggle');
      expect(mobileToggleClasses).not.toContain('os-header__mobile-toggle--open');

      component.mobileMenuOpen.set(true);
      fixture.detectChanges();
      mobileToggleClasses = component.mobileToggleClasses();
      expect(mobileToggleClasses).toContain('os-header__mobile-toggle--open');
    });

    it('should compute avatar size correctly', () => {
      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();

      const avatarSize = component.getAvatarSize();
      expect(avatarSize).toBe('lg');
    });

    it('should compute navigation variant correctly', () => {
      fixture.componentRef.setInput('theme', 'dark');
      fixture.detectChanges();

      const navigationVariant = component.getNavigationVariant();
      expect(navigationVariant).toBe('accent');
    });

    it('should compute navigation size correctly', () => {
      fixture.componentRef.setInput('size', 'small');
      fixture.detectChanges();

      const navigationSize = component.getNavigationSize();
      expect(navigationSize).toBe('small');
    });
  });

  describe('Edge Cases', () => {
    it('should handle navigation outputs correctly', () => {
      expect(component.navigationClick).toBeDefined();
    });

    it('should handle empty actions', () => {
      fixture.componentRef.setInput('actions', []);
      fixture.detectChanges();

      const actionButtons = fixture.debugElement.query(By.css('.os-header__action-buttons'));
      expect(actionButtons).toBeFalsy();
    });

    it('should handle empty user menu items', () => {
      fixture.componentRef.setInput('showUserMenu', true);
      fixture.componentRef.setInput('userMenuItems', []);
      component.userMenuOpen.set(true);
      fixture.detectChanges();

      const menuItems = fixture.debugElement.queryAll(By.css('.os-header__user-menu-item'));
      expect(menuItems.length).toBe(0);
    });

    it('should handle disabled user menu items', () => {
      const mockUserMenuItems: HeaderUserMenu[] = [
        { label: 'Profile', icon: 'user', route: '/profile' },
        { label: 'Disabled', icon: 'lock', disabled: true },
      ];

      fixture.componentRef.setInput('showUserMenu', true);
      fixture.componentRef.setInput('userMenuItems', mockUserMenuItems);
      component.userMenuOpen.set(true);
      fixture.detectChanges();

      const menuItems = fixture.debugElement.queryAll(By.css('.os-header__user-menu-item'));
      expect(
        menuItems[1].nativeElement.classList.contains('os-header__user-menu-item--disabled')
      ).toBe(true);
    });

    it('should handle user menu items with dividers', () => {
      const mockUserMenuItems: HeaderUserMenu[] = [
        { label: 'Profile', icon: 'user', route: '/profile' },
        { label: 'Divider', divider: true },
        { label: 'Logout', icon: 'logout', action: 'logout' },
      ];

      fixture.componentRef.setInput('showUserMenu', true);
      fixture.componentRef.setInput('userMenuItems', mockUserMenuItems);
      component.userMenuOpen.set(true);
      fixture.detectChanges();

      const dividers = fixture.debugElement.queryAll(By.css('.os-header__user-divider'));
      expect(dividers.length).toBe(1);
    });
  });
});
