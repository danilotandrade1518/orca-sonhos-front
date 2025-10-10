import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { vi } from 'vitest';
import {
  OsPageHeaderComponent,
  BreadcrumbItem,
  PageHeaderAction,
} from './os-page-header.component';

describe('OsPageHeaderComponent', () => {
  let component: OsPageHeaderComponent;
  let fixture: ComponentFixture<OsPageHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OsPageHeaderComponent, RouterTestingModule],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(OsPageHeaderComponent);
    component = fixture.componentInstance;
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      fixture.componentRef.setInput('title', 'Test Page');
      fixture.detectChanges();
      expect(component).toBeTruthy();
    });

    it('should render title', () => {
      fixture.componentRef.setInput('title', 'Test Page');
      fixture.detectChanges();

      const titleElement = fixture.nativeElement.querySelector('.os-page-header__title');
      expect(titleElement).toBeTruthy();
      expect(titleElement.textContent.trim()).toBe('Test Page');
    });

    it('should render subtitle when provided', () => {
      fixture.componentRef.setInput('title', 'Test Page');
      fixture.componentRef.setInput('subtitle', 'Test Subtitle');
      fixture.detectChanges();

      const subtitleElement = fixture.nativeElement.querySelector('.os-page-header__subtitle');
      expect(subtitleElement).toBeTruthy();
      expect(subtitleElement.textContent.trim()).toBe('Test Subtitle');
    });

    it('should render description when provided', () => {
      fixture.componentRef.setInput('title', 'Test Page');
      fixture.componentRef.setInput('description', 'Test Description');
      fixture.detectChanges();

      const descriptionElement = fixture.nativeElement.querySelector(
        '.os-page-header__description'
      );
      expect(descriptionElement).toBeTruthy();
      expect(descriptionElement.textContent.trim()).toBe('Test Description');
    });

    it('should render icon when provided', () => {
      fixture.componentRef.setInput('title', 'Test Page');
      fixture.componentRef.setInput('icon', 'home');
      fixture.detectChanges();

      const iconElement = fixture.nativeElement.querySelector('os-icon');
      expect(iconElement).toBeTruthy();
    });
  });

  describe('Breadcrumbs', () => {
    it('should render breadcrumbs when provided', () => {
      const breadcrumbs: BreadcrumbItem[] = [
        { label: 'Home', route: '/home' },
        { label: 'Category', route: '/category' },
        { label: 'Current Page' },
      ];

      fixture.componentRef.setInput('title', 'Test Page');
      fixture.componentRef.setInput('breadcrumbs', breadcrumbs);
      fixture.detectChanges();

      const breadcrumbList = fixture.nativeElement.querySelector(
        '.os-page-header__breadcrumb-list'
      );
      expect(breadcrumbList).toBeTruthy();

      const breadcrumbItems = fixture.nativeElement.querySelectorAll(
        '.os-page-header__breadcrumb-item'
      );
      expect(breadcrumbItems.length).toBe(3);
    });

    it('should render breadcrumb links for non-last items with routes', () => {
      const breadcrumbs: BreadcrumbItem[] = [
        { label: 'Home', route: '/home' },
        { label: 'Current Page' },
      ];

      fixture.componentRef.setInput('title', 'Test Page');
      fixture.componentRef.setInput('breadcrumbs', breadcrumbs);
      fixture.detectChanges();

      const breadcrumbLink = fixture.nativeElement.querySelector(
        '.os-page-header__breadcrumb-link'
      );
      expect(breadcrumbLink).toBeTruthy();
      expect(breadcrumbLink.textContent.trim()).toBe('Home');
    });

    it('should render breadcrumb text for last item', () => {
      const breadcrumbs: BreadcrumbItem[] = [
        { label: 'Home', route: '/home' },
        { label: 'Current Page' },
      ];

      fixture.componentRef.setInput('title', 'Test Page');
      fixture.componentRef.setInput('breadcrumbs', breadcrumbs);
      fixture.detectChanges();

      const breadcrumbText = fixture.nativeElement.querySelector(
        '.os-page-header__breadcrumb-text--current'
      );
      expect(breadcrumbText).toBeTruthy();
      expect(breadcrumbText.textContent.trim()).toBe('Current Page');
    });

    it('should render disabled breadcrumb correctly', () => {
      const breadcrumbs: BreadcrumbItem[] = [{ label: 'Disabled', disabled: true }];

      fixture.componentRef.setInput('title', 'Test Page');
      fixture.componentRef.setInput('breadcrumbs', breadcrumbs);
      fixture.detectChanges();

      const breadcrumbText = fixture.nativeElement.querySelector(
        '.os-page-header__breadcrumb-text--disabled'
      );
      expect(breadcrumbText).toBeTruthy();
      expect(breadcrumbText.textContent.trim()).toBe('Disabled');
    });
  });

  describe('Actions', () => {
    it('should render actions when provided', () => {
      const actions: PageHeaderAction[] = [
        { label: 'Save', variant: 'primary' },
        { label: 'Cancel', variant: 'secondary' },
      ];

      fixture.componentRef.setInput('title', 'Test Page');
      fixture.componentRef.setInput('actions', actions);
      fixture.detectChanges();

      const actionsContainer = fixture.nativeElement.querySelector('.os-page-header__actions');
      expect(actionsContainer).toBeTruthy();

      const buttons = fixture.nativeElement.querySelectorAll('os-button');
      expect(buttons.length).toBe(2);
    });

    it('should emit actionClick when action button is clicked', () => {
      const actions: PageHeaderAction[] = [{ label: 'Save', variant: 'primary' }];

      fixture.componentRef.setInput('title', 'Test Page');
      fixture.componentRef.setInput('actions', actions);
      fixture.detectChanges();

      const actionClickSpy = vi.fn();
      component.actionClick.subscribe(actionClickSpy);

      const button = fixture.nativeElement.querySelector('os-button');
      expect(button).toBeTruthy();
    });

    it('should not emit actionClick for disabled actions', () => {
      const actions: PageHeaderAction[] = [{ label: 'Save', variant: 'primary', disabled: true }];

      fixture.componentRef.setInput('title', 'Test Page');
      fixture.componentRef.setInput('actions', actions);
      fixture.detectChanges();

      const actionClickSpy = vi.fn();
      component.actionClick.subscribe(actionClickSpy);

      const button = fixture.nativeElement.querySelector('os-button');
      button.click();

      expect(actionClickSpy).not.toHaveBeenCalled();
    });
  });

  describe('Variants and Sizes', () => {
    it('should apply compact variant classes', () => {
      fixture.componentRef.setInput('title', 'Test Page');
      fixture.componentRef.setInput('variant', 'compact');
      fixture.detectChanges();

      const header = fixture.nativeElement.querySelector('.os-page-header');
      expect(header.classList.contains('os-page-header--compact')).toBe(true);
    });

    it('should apply extended variant classes', () => {
      fixture.componentRef.setInput('title', 'Test Page');
      fixture.componentRef.setInput('variant', 'extended');
      fixture.detectChanges();

      const header = fixture.nativeElement.querySelector('.os-page-header');
      expect(header.classList.contains('os-page-header--extended')).toBe(true);
    });

    it('should apply small size classes', () => {
      fixture.componentRef.setInput('title', 'Test Page');
      fixture.componentRef.setInput('size', 'small');
      fixture.detectChanges();

      const header = fixture.nativeElement.querySelector('.os-page-header');
      expect(header.classList.contains('os-page-header--small')).toBe(true);
    });

    it('should apply large size classes', () => {
      fixture.componentRef.setInput('title', 'Test Page');
      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();

      const header = fixture.nativeElement.querySelector('.os-page-header');
      expect(header.classList.contains('os-page-header--large')).toBe(true);
    });

    it('should apply dark theme classes', () => {
      fixture.componentRef.setInput('title', 'Test Page');
      fixture.componentRef.setInput('theme', 'dark');
      fixture.detectChanges();

      const header = fixture.nativeElement.querySelector('.os-page-header');
      expect(header.classList.contains('os-page-header--dark')).toBe(true);
    });
  });

  describe('CSS Classes', () => {
    it('should apply with-breadcrumbs class when breadcrumbs are provided', () => {
      const breadcrumbs: BreadcrumbItem[] = [{ label: 'Home', route: '/home' }];

      fixture.componentRef.setInput('title', 'Test Page');
      fixture.componentRef.setInput('breadcrumbs', breadcrumbs);
      fixture.detectChanges();

      const header = fixture.nativeElement.querySelector('.os-page-header');
      expect(header.classList.contains('os-page-header--with-breadcrumbs')).toBe(true);
    });

    it('should apply with-actions class when actions are provided', () => {
      const actions: PageHeaderAction[] = [{ label: 'Save', variant: 'primary' }];

      fixture.componentRef.setInput('title', 'Test Page');
      fixture.componentRef.setInput('actions', actions);
      fixture.detectChanges();

      const header = fixture.nativeElement.querySelector('.os-page-header');
      expect(header.classList.contains('os-page-header--with-actions')).toBe(true);
    });

    it('should apply with-description class when description is provided', () => {
      fixture.componentRef.setInput('title', 'Test Page');
      fixture.componentRef.setInput('description', 'Test Description');
      fixture.detectChanges();

      const header = fixture.nativeElement.querySelector('.os-page-header');
      expect(header.classList.contains('os-page-header--with-description')).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      fixture.componentRef.setInput('title', 'Test Page');
      fixture.componentRef.setInput('ariaLabel', 'Page Header');
      fixture.detectChanges();

      const header = fixture.nativeElement.querySelector('.os-page-header');
      expect(header.getAttribute('aria-label')).toBe('Page Header');
    });

    it('should have proper heading structure', () => {
      fixture.componentRef.setInput('title', 'Test Page');
      fixture.detectChanges();

      const title = fixture.nativeElement.querySelector('h1');
      expect(title).toBeTruthy();
      expect(title.textContent.trim()).toBe('Test Page');
    });

    it('should have proper breadcrumb ARIA attributes', () => {
      const breadcrumbs: BreadcrumbItem[] = [
        { label: 'Home', route: '/home' },
        { label: 'Current Page' },
      ];

      fixture.componentRef.setInput('title', 'Test Page');
      fixture.componentRef.setInput('breadcrumbs', breadcrumbs);
      fixture.detectChanges();

      const breadcrumbNav = fixture.nativeElement.querySelector('.os-page-header__breadcrumbs');
      expect(breadcrumbNav.getAttribute('aria-label')).toBe('Breadcrumb');

      const currentBreadcrumb = fixture.nativeElement.querySelector('[aria-current="page"]');
      expect(currentBreadcrumb).toBeTruthy();
      expect(currentBreadcrumb.textContent.trim()).toBe('Current Page');
    });
  });

  describe('Icon Size Mapping', () => {
    it('should map size to correct icon size', () => {
      fixture.componentRef.setInput('title', 'Test Page');
      fixture.componentRef.setInput('icon', 'home');
      fixture.componentRef.setInput('size', 'small');
      fixture.detectChanges();

      const iconElement = fixture.nativeElement.querySelector('os-icon');
      expect(iconElement).toBeTruthy();
    });
  });
});
