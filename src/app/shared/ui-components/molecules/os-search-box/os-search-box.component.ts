import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { OsButtonComponent } from '../../atoms/os-button/os-button.component';
import { OsInputComponent } from '../../atoms/os-input/os-input.component';

export type OsSearchBoxSize = 'small' | 'medium' | 'large';
export type OsSearchBoxVariant = 'default' | 'outlined' | 'filled';

export interface OsSearchSuggestion {
  id: string;
  text: string;
  category?: string;
}

@Component({
  selector: 'os-search-box',
  standalone: true,
  imports: [CommonModule, OsInputComponent, OsButtonComponent],
  template: `
    <div class="os-search-box" [class]="searchBoxClasses()">
      <os-input
        [value]="value()"
        [placeholder]="placeholder()"
        [disabled]="disabled()"
        [size]="size()"
        [prefixIcon]="'search'"
        [clearable]="true"
        (valueChange)="onValueChange($event)"
        (focusEvent)="onFocus($event)"
        (blurEvent)="onBlur($event)"
        (keydown)="onKeydown($event)"
      />

      @if (showSuggestions() && suggestions().length > 0) {
      <div class="os-search-box__suggestions" [class]="suggestionsClass()">
        @for (suggestion of suggestions(); track suggestion.id) {
        <os-button
          variant="tertiary"
          size="small"
          [class]="suggestionClass()"
          (buttonClick)="onSuggestionClick(suggestion)"
          [attr.aria-label]="'Selecionar: ' + suggestion.text"
        >
          @if (suggestion.category) {
          <span class="os-search-box__suggestion-category">{{ suggestion.category }}</span>
          }
          <span class="os-search-box__suggestion-text">{{ suggestion.text }}</span>
        </os-button>
        }
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

  valueChange = output<string>();
  suggestionSelect = output<OsSearchSuggestion>();
  searchEvent = output<string>();
  focusEvent = output<FocusEvent>();
  blurEvent = output<FocusEvent>();

  protected inputSize = computed(() => {
    const sizeMap: Record<OsSearchBoxSize, 'small' | 'medium' | 'large'> = {
      small: 'small',
      medium: 'medium',
      large: 'large',
    };
    return sizeMap[this.size()];
  });

  searchBoxClasses = () => {
    const classes = ['os-search-box'];

    if (this.size() !== 'medium') {
      classes.push(`os-search-box--${this.size()}`);
    }

    if (this.variant() !== 'default') {
      classes.push(`os-search-box--${this.variant()}`);
    }

    return classes.join(' ');
  };

  suggestionsClass = () => {
    const classes = ['os-search-box__suggestions'];

    if (this.size() !== 'medium') {
      classes.push(`os-search-box__suggestions--${this.size()}`);
    }

    return classes.join(' ');
  };

  suggestionClass = () => {
    const classes = ['os-search-box__suggestion'];

    if (this.size() !== 'medium') {
      classes.push(`os-search-box__suggestion--${this.size()}`);
    }

    return classes.join(' ');
  };

  onValueChange(value: string): void {
    this.valueChange.emit(value);
  }

  onFocus(event: FocusEvent): void {
    this.focusEvent.emit(event);
  }

  onBlur(event: FocusEvent): void {
    this.blurEvent.emit(event);
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      const target = event.target as HTMLInputElement;
      this.searchEvent.emit(target.value);
    }
  }

  onSuggestionClick(suggestion: OsSearchSuggestion): void {
    this.suggestionSelect.emit(suggestion);
    this.valueChange.emit(suggestion.text);
  }
}
