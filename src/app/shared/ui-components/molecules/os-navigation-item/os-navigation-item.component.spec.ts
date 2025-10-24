import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { vi } from 'vitest';
import { OsNavigationItemComponent } from './os-navigation-item.component';

describe('OsNavigationItemComponent', () => {
  let component: OsNavigationItemComponent;
  let fixture: ComponentFixture<OsNavigationItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OsNavigationItemComponent, RouterTestingModule],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(OsNavigationItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('rendering', () => {
    it('should render as button when no routerLink is provided', () => {
      fixture.componentRef.setInput('label', 'Test Item');
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('button');
      expect(button).toBeTruthy();
      expect(button.querySelector('.os-navigation-item__text')).toBeTruthy();
    });

    it('should render as link when routerLink is provided', () => {
      fixture.componentRef.setInput('routerLink', '/test');
      fixture.componentRef.setInput('label', 'Test Link');
      fixture.detectChanges();

      const link = fixture.nativeElement.querySelector('a');
      expect(link).toBeTruthy();
      expect(link.getAttribute('href')).toBe('/test');
      expect(link.querySelector('.os-navigation-item__text')).toBeTruthy();
    });

    it('should render with icon when provided', () => {
      fixture.componentRef.setInput('icon', 'home');
      fixture.detectChanges();

      const icon = fixture.nativeElement.querySelector('os-icon');
      expect(icon).toBeTruthy();
    });

    it('should render with badge when provided', () => {
      fixture.componentRef.setInput('badge', 5);
      fixture.detectChanges();

      const badge = fixture.nativeElement.querySelector('.os-navigation-item__badge');
      expect(badge).toBeTruthy();
      expect(badge.textContent.trim()).toBe('5');
    });

    it('should render badge as 99+ when value is greater than 99', () => {
      fixture.componentRef.setInput('badge', 150);
      fixture.detectChanges();

      const badge = fixture.nativeElement.querySelector('.os-navigation-item__badge');
      expect(badge.textContent.trim()).toBe('99+');
    });
  });

  describe('variants', () => {
    it('should apply default variant classes', () => {
      fixture.componentRef.setInput('variant', 'default');
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('.os-navigation-item');
      expect(container.classList.contains('os-navigation-item--default')).toBeFalsy();
    });

    it('should apply primary variant classes', () => {
      fixture.componentRef.setInput('variant', 'primary');
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('.os-navigation-item');
      expect(container.classList.contains('os-navigation-item--primary')).toBeTruthy();
    });

    it('should apply secondary variant classes', () => {
      fixture.componentRef.setInput('variant', 'secondary');
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('.os-navigation-item');
      expect(container.classList.contains('os-navigation-item--secondary')).toBeTruthy();
    });

    it('should apply accent variant classes', () => {
      fixture.componentRef.setInput('variant', 'accent');
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('.os-navigation-item');
      expect(container.classList.contains('os-navigation-item--accent')).toBeTruthy();
    });
  });

  describe('sizes', () => {
    it('should apply small size classes', () => {
      fixture.componentRef.setInput('size', 'small');
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('.os-navigation-item');
      expect(container.classList.contains('os-navigation-item--small')).toBeTruthy();
    });

    it('should apply medium size classes', () => {
      fixture.componentRef.setInput('size', 'medium');
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('.os-navigation-item');
      // Para medium, não há classe específica (é o padrão)
      expect(container.classList.contains('os-navigation-item')).toBeTruthy();
      expect(container.classList.contains('os-navigation-item--medium')).toBeFalsy();
    });

    it('should apply large size classes', () => {
      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('.os-navigation-item');
      expect(container.classList.contains('os-navigation-item--large')).toBeTruthy();
    });
  });

  describe('states', () => {
    it('should apply disabled state classes', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('.os-navigation-item');
      expect(container.classList.contains('os-navigation-item--disabled')).toBeTruthy();
    });

    it('should apply active state classes', () => {
      fixture.componentRef.setInput('active', true);
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('.os-navigation-item');
      expect(container.classList.contains('os-navigation-item--active')).toBeTruthy();
    });
  });

  describe('interactions', () => {
    it('should emit click event when clicked', () => {
      const clickSpy = vi.fn();
      component.itemClicked.subscribe(clickSpy);

      const button = fixture.nativeElement.querySelector('button');
      button.click();

      expect(clickSpy).toHaveBeenCalled();
    });

    it('should not emit click event when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const clickSpy = vi.fn();
      component.itemClicked.subscribe(clickSpy);

      const button = fixture.nativeElement.querySelector('button');
      button.click();

      expect(clickSpy).not.toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('should set aria-current when active', () => {
      fixture.componentRef.setInput('active', true);
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('button');
      expect(button.getAttribute('aria-current')).toBe('page');
    });

    it('should set aria-label when provided', () => {
      fixture.componentRef.setInput('ariaLabel', 'Custom label');
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('button');
      expect(button.getAttribute('aria-label')).toBe('Custom label');
    });

    it('should set aria-label for badge', () => {
      fixture.componentRef.setInput('badge', 5);
      fixture.detectChanges();

      const badge = fixture.nativeElement.querySelector('.os-navigation-item__badge');
      expect(badge.getAttribute('aria-label')).toBe('5 notifications');
    });
  });

  describe('computed properties', () => {
    it('should compute isActive correctly', () => {
      fixture.componentRef.setInput('active', true);
      fixture.detectChanges();

      expect(component.isActive()).toBe(true);
    });

    it('should compute container class correctly', () => {
      fixture.componentRef.setInput('variant', 'primary');
      fixture.componentRef.setInput('size', 'large');
      fixture.componentRef.setInput('active', true);
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('.os-navigation-item');
      expect(container.classList.contains('os-navigation-item--primary')).toBeTruthy();
      expect(container.classList.contains('os-navigation-item--large')).toBeTruthy();
      expect(container.classList.contains('os-navigation-item--active')).toBeTruthy();
    });
  });
});
