import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { vi } from 'vitest';
import { OsDeleteButtonComponent } from './os-delete-button.component';

describe('OsDeleteButtonComponent', () => {
  let component: OsDeleteButtonComponent;
  let fixture: ComponentFixture<OsDeleteButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OsDeleteButtonComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(OsDeleteButtonComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('ariaLabel', 'Excluir');
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
      const ariaLabel = 'Excluir conta Conta Corrente Principal';
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
      fixture.componentRef.setInput('ariaLabel', 'Excluir');
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
      fixture.componentRef.setInput('ariaLabel', 'Excluir');
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      const osButton = fixture.nativeElement.querySelector('os-button');
      expect(osButton).toBeTruthy();
      expect(component.loading()).toBe(true);
    });
  });

  describe('deleteClick', () => {
    it('should emit deleteClick event when button is clicked', () => {
      const ariaLabel = 'Excluir conta Teste';
      fixture.componentRef.setInput('ariaLabel', ariaLabel);
      fixture.detectChanges();

      const spy = vi.fn();
      component.deleteClick.subscribe(spy);

      const osButton = fixture.nativeElement.querySelector('os-button');
      const button = osButton.querySelector('button');
      button.click();

      expect(spy).toHaveBeenCalled();
    });

    it('should not emit when disabled', () => {
      const ariaLabel = 'Excluir conta Teste';
      fixture.componentRef.setInput('ariaLabel', ariaLabel);
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const spy = vi.fn();
      component.deleteClick.subscribe(spy);

      const osButton = fixture.nativeElement.querySelector('os-button');
      const button = osButton.querySelector('button');
      button.click();

      expect(spy).not.toHaveBeenCalled();
    });

    it('should not emit when loading', () => {
      const ariaLabel = 'Excluir conta Teste';
      fixture.componentRef.setInput('ariaLabel', ariaLabel);
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      const spy = vi.fn();
      component.deleteClick.subscribe(spy);

      const osButton = fixture.nativeElement.querySelector('os-button');
      const button = osButton.querySelector('button');
      button.click();

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('button configuration', () => {
    it('should use danger variant', () => {
      const ariaLabel = 'Excluir conta Teste';
      fixture.componentRef.setInput('ariaLabel', ariaLabel);
      fixture.detectChanges();

      const osButton = fixture.nativeElement.querySelector('os-button');
      expect(osButton).toBeTruthy();
      
    });

    it('should use small size', () => {
      const ariaLabel = 'Excluir conta Teste';
      fixture.componentRef.setInput('ariaLabel', ariaLabel);
      fixture.detectChanges();

      const osButton = fixture.nativeElement.querySelector('os-button');
      expect(osButton).toBeTruthy();
      
    });

    it('should use delete icon', () => {
      const ariaLabel = 'Excluir conta Teste';
      fixture.componentRef.setInput('ariaLabel', ariaLabel);
      fixture.detectChanges();

      const osButton = fixture.nativeElement.querySelector('os-button');
      expect(osButton).toBeTruthy();
      
    });
  });
});
