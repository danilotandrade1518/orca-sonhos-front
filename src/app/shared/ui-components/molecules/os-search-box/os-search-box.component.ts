import { Component, input, output, ChangeDetectionStrategy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

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
  imports: [CommonModule, MatInputModule, MatFormFieldModule, MatIconModule, MatButtonModule],
  template: `
    <div class="os-search-box" [class]="searchBoxClasses()">
      <mat-form-field [appearance]="appearance()" [class]="formFieldClass()">
        <mat-label>{{ placeholder() }}</mat-label>
        <input
          matInput
          [value]="value()"
          [placeholder]="placeholder()"
          [disabled]="disabled()"
          (input)="onInput($event)"
          (focus)="onFocus($event)"
          (blur)="onBlur($event)"
          (keydown)="onKeydown($event)"
        />
        <mat-icon matPrefix>search</mat-icon>
        @if (value() && !disabled()) {
        <button
          matSuffix
          mat-icon-button
          type="button"
          class="os-search-box__clear"
          (click)="onClear()"
          [attr.aria-label]="'Limpar busca'"
        >
          <mat-icon>close</mat-icon>
        </button>
        }
      </mat-form-field>

      @if (showSuggestions() && suggestions().length > 0) {
      <div class="os-search-box__suggestions" [class]="suggestionsClass()">
        @for (suggestion of suggestions(); track suggestion.id) {
        <button
          class="os-search-box__suggestion"
          [class]="suggestionClass(suggestion)"
          (click)="onSuggestionClick(suggestion)"
          [attr.aria-label]="'Selecionar: ' + suggestion.text"
        >
          @if (suggestion.category) {
          <span class="os-search-box__suggestion-category">{{ suggestion.category }}</span>
          }
          <span class="os-search-box__suggestion-text">{{ suggestion.text }}</span>
        </button>
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
  search = output<string>();
  suggestionSelect = output<OsSearchSuggestion>();
  focus = output<FocusEvent>();
  blur = output<FocusEvent>();

  protected appearance = computed(() => {
    const variantMap: Record<OsSearchBoxVariant, 'outline' | 'fill'> = {
      default: 'outline',
      outlined: 'outline',
      filled: 'fill',
    };
    return variantMap[this.variant()];
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

  formFieldClass = () => {
    const classes = ['os-search-box__field'];

    if (this.size() !== 'medium') {
      classes.push(`os-search-box__field--${this.size()}`);
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

  suggestionClass = (suggestion: OsSearchSuggestion) => {
    const classes = ['os-search-box__suggestion'];

    if (this.size() !== 'medium') {
      classes.push(`os-search-box__suggestion--${this.size()}`);
    }

    return classes.join(' ');
  };

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.valueChange.emit(target.value);
  }

  onFocus(event: FocusEvent): void {
    this.focus.emit(event);
  }

  onBlur(event: FocusEvent): void {
    this.blur.emit(event);
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      const target = event.target as HTMLInputElement;
      this.search.emit(target.value);
    }
  }

  onClear(): void {
    this.valueChange.emit('');
  }

  onSuggestionClick(suggestion: OsSearchSuggestion): void {
    this.suggestionSelect.emit(suggestion);
    this.valueChange.emit(suggestion.text);
  }
}
