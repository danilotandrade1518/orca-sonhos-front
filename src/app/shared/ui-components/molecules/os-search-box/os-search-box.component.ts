import { ChangeDetectionStrategy, Component, computed, input, output, signal, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

import { OsButtonComponent } from '../../atoms/os-button/os-button.component';
import { OsInputComponent } from '../../atoms/os-input/os-input.component';

export type OsSearchBoxSize = 'small' | 'medium' | 'large';
export type OsSearchBoxVariant = 'default' | 'outlined' | 'filled';
export type OsSearchBoxRole = 'searchbox' | 'combobox' | 'textbox';

export interface OsSearchSuggestion {
  id: string;
  text: string;
  category?: string;
  highlightedText?: string;
}

@Component({
  selector: 'os-search-box',
  standalone: true,
  imports: [OsInputComponent, OsButtonComponent],
  template: `
    <div
      class="os-search-box"
      [class]="searchBoxClasses()"
      [attr.role]="role()"
      [attr.aria-controls]="showSuggestions() ? suggestionsListboxId() : null"
      [attr.aria-expanded]="showSuggestions() && suggestions().length > 0"
      [attr.aria-haspopup]="showSuggestions() ? 'listbox' : null"
      [attr.aria-activedescendant]="activeSuggestionId()"
      [attr.aria-describedby]="ariaDescribedBy() || null"
    >
      <os-input
        [value]="value()"
        [placeholder]="placeholder()"
        [disabled]="disabled()"
        [size]="inputSize()"
        [prefixIcon]="'search'"
        [clearable]="true"
        [ariaLabel]="ariaLabel()"
        (valueChange)="onValueChange($event)"
        (focusEvent)="onFocus($event)"
        (blurEvent)="onBlur($event)"
        (keydown)="onKeydown($event)"
      />

      @if (showSuggestions() && filteredSuggestions().length > 0) {
      <div
        class="os-search-box__suggestions"
        [class]="suggestionsClass()"
        role="listbox"
        [attr.id]="suggestionsListboxId()"
        [attr.aria-label]="'Sugestões de busca'"
      >
        @for (suggestion of filteredSuggestions(); track suggestion.id; let i = $index) {
        <os-button
          variant="tertiary"
          size="small"
          [class]="suggestionClass()"
          [class.os-search-box__suggestion--active]="i === activeSuggestionIndex()"
          (buttonClick)="onSuggestionClick(suggestion)"
          (mouseenter)="onSuggestionHover(suggestion, i)"
          [attr.aria-label]="'Selecionar: ' + suggestion.text"
          [attr.aria-posinset]="i + 1"
          [attr.aria-setsize]="filteredSuggestions().length"
          [attr.id]="'suggestion-' + suggestion.id"
        >
          @if (suggestion.category) {
          <span class="os-search-box__suggestion-category">{{ suggestion.category }}</span>
          }
          <span
            class="os-search-box__suggestion-text"
            [innerHTML]="suggestion.highlightedText || suggestion.text"
          ></span>
        </os-button>
        }
      </div>
      } @if (showSuggestions() && suggestions().length > 0 && filteredSuggestions().length === 0) {
      <div class="os-search-box__no-results" role="status" [attr.aria-live]="'polite'">
        <span class="os-search-box__no-results-text">Nenhuma sugestão encontrada</span>
      </div>
      }
    </div>
  `,
  styleUrl: './os-search-box.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'os-search-box-host',
  },
})
export class OsSearchBoxComponent {
  
  value = input<string>('');
  placeholder = input<string>('Buscar...');
  disabled = input<boolean>(false);
  size = input<OsSearchBoxSize>('medium');
  variant = input<OsSearchBoxVariant>('default');
  showSuggestions = input<boolean>(true);
  suggestions = input<OsSearchSuggestion[]>([]);
  maxSuggestions = input<number>(5);
  debounceTime = input<number>(300);
  role = input<OsSearchBoxRole>('searchbox');
  ariaLabel = input<string>('');
  ariaDescribedBy = input<string>('');
  enableHighlight = input<boolean>(true);
  enableKeyboardNavigation = input<boolean>(true);
  enableAdvancedFilters = input<boolean>(false);
  
  valueChange = output<string>();
  suggestionSelect = output<OsSearchSuggestion>();
  searchEvent = output<string>();
  focusEvent = output<FocusEvent>();
  blurEvent = output<FocusEvent>();
  debouncedSearch = output<string>();
  suggestionHover = output<OsSearchSuggestion>();
  
  private searchSubject = new Subject<string>();
  protected activeSuggestionIndex = signal<number>(-1);
  private isFocused = signal<boolean>(false);
  private searchHistory = signal<string[]>([]);
  private static nextId = 0;
  private readonly instanceId = OsSearchBoxComponent.nextId++;
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    
    this.searchSubject
      .pipe(
        debounceTime(this.debounceTime()),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((value) => {
        this.debouncedSearch.emit(value);
      });
  }
  
  protected inputSize = computed(() => {
    const sizeMap: Record<OsSearchBoxSize, 'small' | 'medium' | 'large'> = {
      small: 'small',
      medium: 'medium',
      large: 'large',
    };
    return sizeMap[this.size()];
  });

  filteredSuggestions = computed(() => {
    const suggestions = this.suggestions();
    const value = this.value().toLowerCase();
    const maxSuggestions = this.maxSuggestions();

    if (!value || !this.enableHighlight()) {
      return suggestions.slice(0, maxSuggestions);
    }

    const filtered = suggestions
      .filter(
        (suggestion) =>
          suggestion.text.toLowerCase().includes(value) ||
          (suggestion.category && suggestion.category.toLowerCase().includes(value))
      )
      .map((suggestion) => ({
        ...suggestion,
        highlightedText: this.enableHighlight()
          ? this.highlightText(suggestion.text, value)
          : suggestion.text,
      }))
      .slice(0, maxSuggestions);

    return filtered;
  });

  suggestionsListboxId = computed(() => `os-search-box-suggestions-${this.instanceId}`);

  activeSuggestionId = computed(() => {
    const index = this.activeSuggestionIndex();
    const suggestions = this.filteredSuggestions();

    if (index >= 0 && index < suggestions.length) {
      return `suggestion-${suggestions[index].id}`;
    }

    return null;
  });

  searchBoxClasses = computed(() => {
    const classes = ['os-search-box'];

    if (this.size() !== 'medium') {
      classes.push(`os-search-box--${this.size()}`);
    }

    if (this.variant() !== 'default') {
      classes.push(`os-search-box--${this.variant()}`);
    }

    if (this.isFocused()) {
      classes.push('os-search-box--focused');
    }

    if (this.disabled()) {
      classes.push('os-search-box--disabled');
    }

    return classes.join(' ');
  });

  suggestionsClass = computed(() => {
    const classes = ['os-search-box__suggestions'];

    if (this.size() !== 'medium') {
      classes.push(`os-search-box__suggestions--${this.size()}`);
    }

    if (this.filteredSuggestions().length === 0) {
      classes.push('os-search-box__suggestions--empty');
    }

    return classes.join(' ');
  });

  suggestionClass = computed(() => {
    const classes = ['os-search-box__suggestion'];

    if (this.size() !== 'medium') {
      classes.push(`os-search-box__suggestion--${this.size()}`);
    }

    return classes.join(' ');
  });
  
  onValueChange(value: string): void {
    this.valueChange.emit(value);
    this.searchSubject.next(value);
    this.resetActiveSuggestion();
  }

  onFocus(event: FocusEvent): void {
    this.isFocused.set(true);
    this.focusEvent.emit(event);
  }

  onBlur(event: FocusEvent): void {
    this.isFocused.set(false);
    this.blurEvent.emit(event);
    this.resetActiveSuggestion();
  }

  onKeydown(event: KeyboardEvent): void {
    if (!this.enableKeyboardNavigation()) return;

    const suggestions = this.filteredSuggestions();
    const currentIndex = this.activeSuggestionIndex();

    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        if (currentIndex >= 0 && currentIndex < suggestions.length) {
          this.selectSuggestion(suggestions[currentIndex]);
        } else {
          this.searchEvent.emit(this.value());
        }
        break;

      case 'ArrowDown':
        event.preventDefault();
        if (suggestions.length > 0) {
          const nextIndex = currentIndex < suggestions.length - 1 ? currentIndex + 1 : 0;
          this.activeSuggestionIndex.set(nextIndex);
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (suggestions.length > 0) {
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : suggestions.length - 1;
          this.activeSuggestionIndex.set(prevIndex);
        }
        break;

      case 'Escape':
        event.preventDefault();
        this.resetActiveSuggestion();
        break;

      case 'Tab':
        if (currentIndex >= 0 && currentIndex < suggestions.length) {
          this.selectSuggestion(suggestions[currentIndex]);
        }
        break;
    }
  }

  onSuggestionClick(suggestion: OsSearchSuggestion): void {
    this.selectSuggestion(suggestion);
  }

  onSuggestionHover(suggestion: OsSearchSuggestion, index: number): void {
    this.activeSuggestionIndex.set(index);
    this.suggestionHover.emit(suggestion);
  }
  
  private selectSuggestion(suggestion: OsSearchSuggestion): void {
    this.suggestionSelect.emit(suggestion);
    this.valueChange.emit(suggestion.text);
    this.resetActiveSuggestion();
    this.addToSearchHistory(suggestion.text);
  }

  private resetActiveSuggestion(): void {
    this.activeSuggestionIndex.set(-1);
  }

  private highlightText(text: string, searchTerm: string): string {
    if (!searchTerm) return text;

    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark class="os-search-box__highlight">$1</mark>');
  }

  private addToSearchHistory(searchTerm: string): void {
    if (!searchTerm.trim()) return;

    const history = this.searchHistory();
    const filtered = history.filter((term) => term !== searchTerm);
    const newHistory = [searchTerm, ...filtered].slice(0, 10); 
    this.searchHistory.set(newHistory);
  }
  
  getSearchHistory(): string[] {
    return this.searchHistory();
  }

  clearSearchHistory(): void {
    this.searchHistory.set([]);
  }

  focus(): void {
    
    this.isFocused.set(true);
  }

  blur(): void {
    this.isFocused.set(false);
  }
}
