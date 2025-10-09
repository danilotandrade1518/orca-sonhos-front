import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { vi } from 'vitest';
import { OsSearchBoxComponent, OsSearchSuggestion } from './os-search-box.component';

describe('OsSearchBoxComponent', () => {
  let component: OsSearchBoxComponent;
  let fixture: ComponentFixture<OsSearchBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OsSearchBoxComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(OsSearchBoxComponent);
    fixture.componentRef.setInput('value', 'test');
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render with default placeholder', () => {
    const input = fixture.nativeElement.querySelector('input');
    expect(input.placeholder).toBe('Buscar...');
  });

  it('should render with custom placeholder', () => {
    fixture.componentRef.setInput('placeholder', 'Custom Search');
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input');
    expect(input.placeholder).toBe('Custom Search');
  });

  it('should apply size classes', () => {
    fixture.componentRef.setInput('size', 'large');
    fixture.detectChanges();

    const searchBox = fixture.nativeElement.querySelector('.os-search-box');
    expect(searchBox.classList.contains('os-search-box--large')).toBe(true);
  });

  it('should apply variant classes', () => {
    fixture.componentRef.setInput('variant', 'outlined');
    fixture.detectChanges();

    const searchBox = fixture.nativeElement.querySelector('.os-search-box');
    expect(searchBox.classList.contains('os-search-box--outlined')).toBe(true);
  });

  it('should show clear button when value is present', () => {
    fixture.componentRef.setInput('value', 'test value');
    fixture.detectChanges();

    const clearButton = fixture.nativeElement.querySelector('.os-search-box__clear');
    expect(clearButton).toBeTruthy();
  });

  it('should not show clear button when value is empty', () => {
    fixture.componentRef.setInput('value', '');
    fixture.detectChanges();

    const clearButton = fixture.nativeElement.querySelector('.os-search-box__clear');
    expect(clearButton).toBeFalsy();
  });

  it('should not show clear button when disabled', () => {
    fixture.componentRef.setInput('value', 'test');
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const clearButton = fixture.nativeElement.querySelector('.os-search-box__clear');
    expect(clearButton).toBeFalsy();
  });

  it('should emit valueChange on input', () => {
    vi.spyOn(component.valueChange, 'emit');

    const input = fixture.nativeElement.querySelector('input');
    input.value = 'new value';
    input.dispatchEvent(new Event('input'));

    expect(component.valueChange.emit).toHaveBeenCalledWith('new value');
  });

  it('should emit search on Enter key', () => {
    vi.spyOn(component.search, 'emit');

    const input = fixture.nativeElement.querySelector('input');
    input.value = 'search term';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

    expect(component.search.emit).toHaveBeenCalledWith('search term');
  });

  it('should emit clear when clear button is clicked', () => {
    vi.spyOn(component.valueChange, 'emit');

    const clearButton = fixture.nativeElement.querySelector('.os-search-box__clear');
    clearButton.click();

    expect(component.valueChange.emit).toHaveBeenCalledWith('');
  });

  it('should show suggestions when available', () => {
    const suggestions: OsSearchSuggestion[] = [
      { id: '1', text: 'Suggestion 1' },
      { id: '2', text: 'Suggestion 2' },
    ];

    fixture.componentRef.setInput('suggestions', suggestions);
    fixture.componentRef.setInput('showSuggestions', true);
    fixture.detectChanges();

    const suggestionsContainer = fixture.nativeElement.querySelector('.os-search-box__suggestions');
    expect(suggestionsContainer).toBeTruthy();

    const suggestionButtons = fixture.nativeElement.querySelectorAll('.os-search-box__suggestion');
    expect(suggestionButtons.length).toBe(2);
  });

  it('should not show suggestions when showSuggestions is false', () => {
    const suggestions: OsSearchSuggestion[] = [{ id: '1', text: 'Suggestion 1' }];

    fixture.componentRef.setInput('suggestions', suggestions);
    fixture.componentRef.setInput('showSuggestions', false);
    fixture.detectChanges();

    const suggestionsContainer = fixture.nativeElement.querySelector('.os-search-box__suggestions');
    expect(suggestionsContainer).toBeFalsy();
  });

  it('should emit suggestionSelect when suggestion is clicked', () => {
    vi.spyOn(component.suggestionSelect, 'emit');
    vi.spyOn(component.valueChange, 'emit');

    const suggestions: OsSearchSuggestion[] = [{ id: '1', text: 'Suggestion 1' }];

    fixture.componentRef.setInput('suggestions', suggestions);
    fixture.detectChanges();

    const suggestionButton = fixture.nativeElement.querySelector('.os-search-box__suggestion');
    suggestionButton.click();

    expect(component.suggestionSelect.emit).toHaveBeenCalledWith(suggestions[0]);
    expect(component.valueChange.emit).toHaveBeenCalledWith('Suggestion 1');
  });

  it('should render suggestion with category', () => {
    const suggestions: OsSearchSuggestion[] = [
      { id: '1', text: 'Suggestion 1', category: 'Category 1' },
    ];

    fixture.componentRef.setInput('suggestions', suggestions);
    fixture.detectChanges();

    const categoryElement = fixture.nativeElement.querySelector(
      '.os-search-box__suggestion-category'
    );
    expect(categoryElement).toBeTruthy();
    expect(categoryElement.textContent).toBe('Category 1');
  });

  it('should have correct default values', () => {
    expect(component.size()).toBe('medium');
    expect(component.variant()).toBe('default');
    expect(component.showSuggestions()).toBe(true);
    expect(component.suggestions()).toEqual([]);
    expect(component.maxSuggestions()).toBe(5);
    expect(component.disabled()).toBe(false);
  });

  it('should emit focus and blur events', () => {
    vi.spyOn(component.focus, 'emit');
    vi.spyOn(component.blur, 'emit');

    const input = fixture.nativeElement.querySelector('input');

    input.dispatchEvent(new FocusEvent('focus'));
    expect(component.focus.emit).toHaveBeenCalled();

    input.dispatchEvent(new FocusEvent('blur'));
    expect(component.blur.emit).toHaveBeenCalled();
  });
});
