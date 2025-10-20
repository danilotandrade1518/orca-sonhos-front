import {
  Component,
  input,
  output,
  computed,
  effect,
  signal,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { OsButtonComponent } from '../../atoms/os-button/os-button.component';

export type OsFilterBarVariant = 'default' | 'compact' | 'expanded';
export type OsFilterBarSize = 'small' | 'medium' | 'large';

export interface OsFilterOption {
  key: string;
  label: string;
  value: string | number | Date | null;
  type: 'text' | 'select' | 'date' | 'number';
  options?: { value: string | number; label: string }[];
}

/**
 * OsFilterBarComponent
 *
 * Barra de filtros responsiva com suporte a persistência em localStorage,
 * acessibilidade WCAG 2.1 AA e touch targets >= 44px para mobile.
 *
 * @example
 * ```html
 * <os-filter-bar
 *   [persistKey]="'budgets-filters'"
 *   [hasActiveFilters]="hasFilters"
 *   (clear)="onClearFilters()"
 *   (apply)="onApplyFilters()">
 *   <!-- Filter inputs here -->
 * </os-filter-bar>
 * ```
 */
@Component({
  selector: 'os-filter-bar',
  standalone: true,
  imports: [CommonModule, OsButtonComponent],
  template: `
    <div
      class="os-filter-bar"
      [class]="filterBarClasses()"
      role="search"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-describedby]="ariaDescribedBy() || null"
    >
      <div class="os-filter-bar__content">
        <ng-content></ng-content>
      </div>

      @if (showActions()) {
      <div class="os-filter-bar__actions">
        @if (showClearButton()) {
        <os-button
          variant="tertiary"
          [size]="getButtonSize()"
          icon="clear"
          [disabled]="!hasActiveFilters()"
          [ariaLabel]="clearButtonAriaLabel()"
          (buttonClick)="onClear()"
        >
          {{ clearButtonText() }}
        </os-button>
        } @if (showApplyButton()) {
        <os-button
          variant="primary"
          [size]="getButtonSize()"
          icon="check"
          [disabled]="!hasActiveFilters()"
          [ariaLabel]="applyButtonAriaLabel()"
          (buttonClick)="onApply()"
        >
          {{ applyButtonText() }}
        </os-button>
        }
      </div>
      }
    </div>
  `,
  styleUrl: './os-filter-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'os-filter-bar-host',
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
  },
})
export class OsFilterBarComponent {
  // --- INPUTS ---
  variant = input<OsFilterBarVariant>('default');
  size = input<OsFilterBarSize>('medium');
  showActions = input<boolean>(true);
  showClearButton = input<boolean>(true);
  showApplyButton = input<boolean>(true);
  clearButtonText = input<string>('Limpar');
  applyButtonText = input<string>('Aplicar');
  hasActiveFilters = input<boolean>(false);

  // Persistência em localStorage
  persistKey = input<string | null>(null);
  persistFilters = input<boolean>(false);

  // Acessibilidade
  ariaLabel = input<string>('Barra de filtros');
  ariaDescribedBy = input<string>('');
  clearButtonAriaLabel = input<string>('Limpar todos os filtros');
  applyButtonAriaLabel = input<string>('Aplicar filtros');

  // --- OUTPUTS ---
  clear = output<void>();
  apply = output<void>();
  filtersRestored = output<Record<string, unknown>>();

  // --- SIGNALS INTERNOS ---
  private isMobile = signal<boolean>(false);

  // --- COMPUTED PROPERTIES ---
  filterBarClasses = computed(() => {
    const classes = ['os-filter-bar'];

    if (this.variant() !== 'default') {
      classes.push(`os-filter-bar--${this.variant()}`);
    }

    if (this.size() !== 'medium') {
      classes.push(`os-filter-bar--${this.size()}`);
    }

    if (this.isMobile()) {
      classes.push('os-filter-bar--mobile');
    }

    return classes.join(' ');
  });

  // --- CONSTRUCTOR ---
  constructor() {
    // Effect para detectar mobile
    effect(
      () => {
        if (typeof window !== 'undefined') {
          const checkMobile = () => {
            this.isMobile.set(window.innerWidth < 768);
          };
          checkMobile();
          window.addEventListener('resize', checkMobile);
        }
      },
      { allowSignalWrites: true }
    );

    // Effect para restaurar filtros persistidos
    effect(
      () => {
        if (this.persistFilters() && this.persistKey()) {
          this.restoreFilters();
        }
      },
      { allowSignalWrites: true }
    );
  }

  // --- MÉTODOS PÚBLICOS ---

  /**
   * Retorna o tamanho do botão baseado no tamanho da filter bar
   */
  getButtonSize(): 'small' | 'medium' | 'large' {
    const sizeMap: Record<OsFilterBarSize, 'small' | 'medium' | 'large'> = {
      small: 'small',
      medium: 'medium',
      large: 'large',
    };
    return sizeMap[this.size()];
  }

  /**
   * Handler para evento de limpar filtros
   */
  onClear(): void {
    if (this.persistFilters() && this.persistKey()) {
      this.clearPersistedFilters();
    }
    this.clear.emit();
  }

  /**
   * Handler para evento de aplicar filtros
   */
  onApply(): void {
    this.apply.emit();
  }

  /**
   * Persiste os filtros atuais no localStorage
   */
  saveFilters(filters: Record<string, unknown>): void {
    if (!this.persistFilters() || !this.persistKey() || typeof window === 'undefined') {
      return;
    }

    try {
      const key = this.getStorageKey();
      localStorage.setItem(key, JSON.stringify(filters));
    } catch (error) {
      console.warn('Falha ao persistir filtros:', error);
    }
  }

  /**
   * Restaura os filtros do localStorage
   */
  restoreFilters(): void {
    if (!this.persistFilters() || !this.persistKey() || typeof window === 'undefined') {
      return;
    }

    try {
      const key = this.getStorageKey();
      const stored = localStorage.getItem(key);

      if (stored) {
        const filters = JSON.parse(stored) as Record<string, unknown>;
        this.filtersRestored.emit(filters);
      }
    } catch (error) {
      console.warn('Falha ao restaurar filtros:', error);
    }
  }

  /**
   * Limpa os filtros persistidos do localStorage
   */
  clearPersistedFilters(): void {
    if (!this.persistKey() || typeof window === 'undefined') {
      return;
    }

    try {
      const key = this.getStorageKey();
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('Falha ao limpar filtros persistidos:', error);
    }
  }

  // --- MÉTODOS PRIVADOS ---

  /**
   * Retorna a chave completa para o localStorage
   */
  private getStorageKey(): string {
    return `os-filter-bar:${this.persistKey()}`;
  }
}
