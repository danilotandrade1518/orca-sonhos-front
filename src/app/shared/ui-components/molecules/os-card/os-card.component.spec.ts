import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { OsCardComponent } from './os-card.component';

describe('OsCardComponent', () => {
  let component: OsCardComponent;
  let fixture: ComponentFixture<OsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OsCardComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(OsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Variant', () => {
    it('should apply default variant by default', () => {
      expect(component.variant()).toBe('default');
    });

    it('should apply outlined variant', () => {
      fixture.componentRef.setInput('variant', 'outlined');
      fixture.detectChanges();

      const cardElement = fixture.nativeElement.querySelector('.os-card');
      expect(cardElement.classList.contains('os-card--outlined')).toBe(true);
    });

    it('should apply elevated variant', () => {
      fixture.componentRef.setInput('variant', 'elevated');
      fixture.detectChanges();

      const cardElement = fixture.nativeElement.querySelector('.os-card');
      expect(cardElement.classList.contains('os-card--elevated')).toBe(true);
    });

    it('should apply flat variant', () => {
      fixture.componentRef.setInput('variant', 'flat');
      fixture.detectChanges();

      const cardElement = fixture.nativeElement.querySelector('.os-card');
      expect(cardElement.classList.contains('os-card--flat')).toBe(true);
    });
  });

  describe('Size', () => {
    it('should apply medium size by default', () => {
      expect(component.size()).toBe('medium');
    });

    it('should apply small size', () => {
      fixture.componentRef.setInput('size', 'small');
      fixture.detectChanges();

      const cardElement = fixture.nativeElement.querySelector('.os-card');
      expect(cardElement.classList.contains('os-card--small')).toBe(true);
    });

    it('should apply large size', () => {
      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();

      const cardElement = fixture.nativeElement.querySelector('.os-card');
      expect(cardElement.classList.contains('os-card--large')).toBe(true);
    });
  });

  describe('Header', () => {
    it('should not show header by default', () => {
      const headerElement = fixture.nativeElement.querySelector('.os-card__header');
      expect(headerElement).toBeFalsy();
    });

    it('should show header when enabled', () => {
      fixture.componentRef.setInput('header', true);
      fixture.detectChanges();

      const headerElement = fixture.nativeElement.querySelector('.os-card__header');
      expect(headerElement).toBeTruthy();
    });
  });

  describe('Actions', () => {
    it('should not show actions by default', () => {
      const actionsElement = fixture.nativeElement.querySelector('.os-card__actions');
      expect(actionsElement).toBeFalsy();
    });

    it('should show actions when enabled', () => {
      fixture.componentRef.setInput('actions', true);
      fixture.detectChanges();

      const actionsElement = fixture.nativeElement.querySelector('.os-card__actions');
      expect(actionsElement).toBeTruthy();
    });
  });

  describe('Clickable', () => {
    it('should not be clickable by default', () => {
      expect(component.clickable()).toBe(false);
    });

    it('should be clickable when enabled', () => {
      fixture.componentRef.setInput('clickable', true);
      fixture.detectChanges();

      const cardElement = fixture.nativeElement.querySelector('.os-card');
      expect(cardElement.classList.contains('os-card--clickable')).toBe(true);
    });

    it('should emit click event when clickable', () => {
      const emitSpy = vi.spyOn(component.cardClick, 'emit');
      fixture.componentRef.setInput('clickable', true);
      fixture.detectChanges();

      const cardElement = fixture.nativeElement.querySelector('.os-card');
      cardElement.click();

      expect(emitSpy).toHaveBeenCalled();
    });

    it('should not emit click event when not clickable', () => {
      const emitSpy = vi.spyOn(component.cardClick, 'emit');
      fixture.componentRef.setInput('clickable', false);
      fixture.detectChanges();

      const cardElement = fixture.nativeElement.querySelector('.os-card');
      cardElement.click();

      expect(emitSpy).not.toHaveBeenCalled();
    });
  });

  describe('Content Projection', () => {
    it('should project content into content area', () => {
      fixture.detectChanges();

      const contentElement = fixture.nativeElement.querySelector('.os-card__content');
      expect(contentElement).toBeTruthy();
    });

    it('should project header content when header is enabled', () => {
      fixture.componentRef.setInput('header', true);
      fixture.detectChanges();

      const headerElement = fixture.nativeElement.querySelector('.os-card__header');
      expect(headerElement).toBeTruthy();
    });

    it('should project actions content when actions are enabled', () => {
      fixture.componentRef.setInput('actions', true);
      fixture.detectChanges();

      const actionsElement = fixture.nativeElement.querySelector('.os-card__actions');
      expect(actionsElement).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes when clickable', () => {
      fixture.componentRef.setInput('clickable', true);
      fixture.detectChanges();

      const cardElement = fixture.nativeElement.querySelector('.os-card');
      expect(cardElement.getAttribute('role')).toBe('button');
      expect(cardElement.getAttribute('tabindex')).toBe('0');
    });

    it('should not have button role when not clickable', () => {
      fixture.componentRef.setInput('clickable', false);
      fixture.detectChanges();

      const cardElement = fixture.nativeElement.querySelector('.os-card');
      expect(cardElement.getAttribute('role')).toBeFalsy();
    });
  });
});
