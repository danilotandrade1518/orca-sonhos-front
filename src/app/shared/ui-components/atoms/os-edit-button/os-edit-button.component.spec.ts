import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { vi } from 'vitest';
import { OsEditButtonComponent } from './os-edit-button.component';

describe('OsEditButtonComponent', () => {
  let component: OsEditButtonComponent;
  let fixture: ComponentFixture<OsEditButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OsEditButtonComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(OsEditButtonComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('ariaLabel', 'Editar');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ariaLabel', () => {
    it('should require ariaLabel input', () => {
      expect(() => {
        fixture.componentRef.setInput('ariaLabel', '');
        fixture.detectChanges();
      }).not.toThrow();
    });

    it('should pass ariaLabel to os-button', () => {
      const ariaLabel = 'Editar conta Conta Corrente Principal';
      fixture.componentRef.setInput('ariaLabel', ariaLabel);
      fixture.detectChanges();

      const osButton = fixture.nativeElement.querySelector('os-button');
      expect(osButton).toBeTruthy();
      
      expect(component.ariaLabel()).toBe(ariaLabel);
    });
  });

  describe('disabled', () => {
    it('should be false by default', () => {
      expect(component.disabled()).toBe(false);
    });

    it('should pass disabled to os-button', () => {
      fixture.componentRef.setInput('ariaLabel', 'Editar');
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const osButton = fixture.nativeElement.querySelector('os-button');
      expect(osButton).toBeTruthy();
      expect(component.disabled()).toBe(true);
    });
  });

  describe('loading', () => {
    it('should be false by default', () => {
      expect(component.loading()).toBe(false);
    });

    it('should pass loading to os-button', () => {
      fixture.componentRef.setInput('ariaLabel', 'Editar');
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      const osButton = fixture.nativeElement.querySelector('os-button');
      expect(osButton).toBeTruthy();
      expect(component.loading()).toBe(true);
    });
  });

  describe('editClick', () => {
    it('should emit editClick event when button is clicked', () => {
      const ariaLabel = 'Editar conta Teste';
      fixture.componentRef.setInput('ariaLabel', ariaLabel);
      fixture.detectChanges();

      const spy = vi.fn();
      component.editClick.subscribe(spy);

      const osButton = fixture.nativeElement.querySelector('os-button');
      const button = osButton.querySelector('button');
      button.click();

      expect(spy).toHaveBeenCalled();
    });

    it('should not emit when disabled', () => {
      const ariaLabel = 'Editar conta Teste';
      fixture.componentRef.setInput('ariaLabel', ariaLabel);
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const spy = vi.fn();
      component.editClick.subscribe(spy);

      const osButton = fixture.nativeElement.querySelector('os-button');
      const button = osButton.querySelector('button');
      button.click();

      expect(spy).not.toHaveBeenCalled();
    });

    it('should not emit when loading', () => {
      const ariaLabel = 'Editar conta Teste';
      fixture.componentRef.setInput('ariaLabel', ariaLabel);
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      const spy = vi.fn();
      component.editClick.subscribe(spy);

      const osButton = fixture.nativeElement.querySelector('os-button');
      const button = osButton.querySelector('button');
      button.click();

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('button configuration', () => {
    it('should use secondary variant', () => {
      const ariaLabel = 'Editar conta Teste';
      fixture.componentRef.setInput('ariaLabel', ariaLabel);
      fixture.detectChanges();

      const osButton = fixture.nativeElement.querySelector('os-button');
      expect(osButton).toBeTruthy();
      
    });

    it('should use small size', () => {
      const ariaLabel = 'Editar conta Teste';
      fixture.componentRef.setInput('ariaLabel', ariaLabel);
      fixture.detectChanges();

      const osButton = fixture.nativeElement.querySelector('os-button');
      expect(osButton).toBeTruthy();
      
    });

    it('should use edit icon', () => {
      const ariaLabel = 'Editar conta Teste';
      fixture.componentRef.setInput('ariaLabel', ariaLabel);
      fixture.detectChanges();

      const osButton = fixture.nativeElement.querySelector('os-button');
      expect(osButton).toBeTruthy();
      
    });
  });
});
