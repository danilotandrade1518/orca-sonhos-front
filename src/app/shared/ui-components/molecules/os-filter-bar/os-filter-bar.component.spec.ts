import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { vi } from 'vitest';
import { OsFilterBarComponent } from './os-filter-bar.component';

describe('OsFilterBarComponent', () => {
  let component: OsFilterBarComponent;
  let fixture: ComponentFixture<OsFilterBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OsFilterBarComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(OsFilterBarComponent);
    fixture.componentRef.setInput('hasActiveFilters', true);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply variant classes', () => {
    fixture.componentRef.setInput('variant', 'compact');
    fixture.detectChanges();

    const filterBar = fixture.nativeElement.querySelector('.os-filter-bar');
    expect(filterBar.classList.contains('os-filter-bar--compact')).toBe(true);
  });

  it('should apply size classes', () => {
    fixture.componentRef.setInput('size', 'large');
    fixture.detectChanges();

    const filterBar = fixture.nativeElement.querySelector('.os-filter-bar');
    expect(filterBar.classList.contains('os-filter-bar--large')).toBe(true);
  });

  it('should show actions by default', () => {
    const actionsElement = fixture.nativeElement.querySelector('.os-filter-bar__actions');
    expect(actionsElement).toBeTruthy();
  });

  it('should hide actions when showActions is false', () => {
    fixture.componentRef.setInput('showActions', false);
    fixture.detectChanges();

    const actionsElement = fixture.nativeElement.querySelector('.os-filter-bar__actions');
    expect(actionsElement).toBeFalsy();
  });

  it('should show clear button by default', () => {
    const clearButton = fixture.nativeElement.querySelector('.os-filter-bar__clear');
    expect(clearButton).toBeTruthy();
  });

  it('should hide clear button when showClearButton is false', () => {
    fixture.componentRef.setInput('showClearButton', false);
    fixture.detectChanges();

    const clearButton = fixture.nativeElement.querySelector('.os-filter-bar__clear');
    expect(clearButton).toBeFalsy();
  });

  it('should show apply button by default', () => {
    const applyButton = fixture.nativeElement.querySelector('.os-filter-bar__apply');
    expect(applyButton).toBeTruthy();
  });

  it('should hide apply button when showApplyButton is false', () => {
    fixture.componentRef.setInput('showApplyButton', false);
    fixture.detectChanges();

    const applyButton = fixture.nativeElement.querySelector('.os-filter-bar__apply');
    expect(applyButton).toBeFalsy();
  });

  it('should disable buttons when hasActiveFilters is false', () => {
    fixture.componentRef.setInput('hasActiveFilters', false);
    fixture.detectChanges();

    const clearButton = fixture.nativeElement.querySelector('.os-filter-bar__clear');
    const applyButton = fixture.nativeElement.querySelector('.os-filter-bar__apply');

    expect(clearButton.disabled).toBe(true);
    expect(applyButton.disabled).toBe(true);
  });

  it('should enable buttons when hasActiveFilters is true', () => {
    fixture.componentRef.setInput('hasActiveFilters', true);
    fixture.detectChanges();

    const clearButton = fixture.nativeElement.querySelector('.os-filter-bar__clear');
    const applyButton = fixture.nativeElement.querySelector('.os-filter-bar__apply');

    expect(clearButton.disabled).toBe(false);
    expect(applyButton.disabled).toBe(false);
  });

  it('should emit clear event when clear button is clicked', () => {
    vi.spyOn(component.clear, 'emit');

    const clearButton = fixture.nativeElement.querySelector('.os-filter-bar__clear');
    clearButton.click();

    expect(component.clear.emit).toHaveBeenCalled();
  });

  it('should emit apply event when apply button is clicked', () => {
    vi.spyOn(component.apply, 'emit');

    const applyButton = fixture.nativeElement.querySelector('.os-filter-bar__apply');
    applyButton.click();

    expect(component.apply.emit).toHaveBeenCalled();
  });

  it('should use custom button texts', () => {
    fixture.componentRef.setInput('clearButtonText', 'Custom Clear');
    fixture.componentRef.setInput('applyButtonText', 'Custom Apply');
    fixture.detectChanges();

    const clearButton = fixture.nativeElement.querySelector('.os-filter-bar__clear');
    const applyButton = fixture.nativeElement.querySelector('.os-filter-bar__apply');

    expect(clearButton.textContent.trim()).toContain('Custom Clear');
    expect(applyButton.textContent.trim()).toContain('Custom Apply');
  });

  it('should have correct default values', () => {
    expect(component.variant()).toBe('default');
    expect(component.size()).toBe('medium');
    expect(component.showActions()).toBe(true);
    expect(component.showClearButton()).toBe(true);
    expect(component.showApplyButton()).toBe(true);
    expect(component.clearButtonText()).toBe('Limpar');
    expect(component.applyButtonText()).toBe('Aplicar');
  });

  it('should render content projection', () => {
    fixture.nativeElement.innerHTML = `
      <os-filter-bar>
        <div class="test-filter">Test Filter</div>
      </os-filter-bar>
    `;
    fixture.detectChanges();

    const contentElement = fixture.nativeElement.querySelector('.test-filter');
    expect(contentElement).toBeTruthy();
    expect(contentElement.textContent).toBe('Test Filter');
  });
});
