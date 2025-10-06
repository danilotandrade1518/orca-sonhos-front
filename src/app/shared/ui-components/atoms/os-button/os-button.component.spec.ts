import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { OsButtonComponent } from './os-button.component';

describe('OsButtonComponent', () => {
  let component: OsButtonComponent;
  let fixture: ComponentFixture<OsButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OsButtonComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(OsButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have primary variant by default', () => {
    expect(component.variant()).toBe('primary');
  });

  it('should have medium size by default', () => {
    expect(component.size()).toBe('medium');
  });

  it('should not be disabled by default', () => {
    expect(component.disabled()).toBe(false);
  });

  it('should not be loading by default', () => {
    expect(component.loading()).toBe(false);
  });

  it('should apply correct classes', () => {
    const classes = component.buttonClasses();
    expect(classes).toContain('os-button');
    expect(classes).toContain('os-button--primary');
    expect(classes).toContain('os-button--medium');
  });

  it('should emit clicked event when clicked', (done) => {
    component.clicked.subscribe(() => {
      done();
    });

    component.handleClick();
  });

  it('should not emit clicked event when disabled', (done) => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    let clicked = false;
    component.clicked.subscribe(() => {
      clicked = true;
    });

    component.handleClick();

    setTimeout(() => {
      expect(clicked).toBe(false);
      done();
    }, 100);
  });

  it('should not emit clicked event when loading', (done) => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    let clicked = false;
    component.clicked.subscribe(() => {
      clicked = true;
    });

    component.handleClick();

    setTimeout(() => {
      expect(clicked).toBe(false);
      done();
    }, 100);
  });
});
