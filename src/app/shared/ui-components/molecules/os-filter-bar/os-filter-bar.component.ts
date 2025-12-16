import {
  Component,
  input,
  output,
  computed,
  effect,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';

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

@Component({
  selector: 'os-filter-bar',
  standalone: true,
  imports: [OsButtonComponent],
  template: `
    <div
      class="os-filter-bar"
      [class]="filterBarClasses()"
      role="search"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-describedby]="ariaDescribedBy() || null"
    >
      <div class="os-filter-bar__content">
        <ng-content />
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
  variant = input<OsFilterBarVariant>('default');
  size = input<OsFilterBarSize>('medium');
  showActions = input<boolean>(true);
  showClearButton = input<boolean>(true);
  showApplyButton = input<boolean>(true);
  clearButtonText = input<string>('Limpar');
  applyButtonText = input<string>('Aplicar');
  hasActiveFilters = input<boolean>(false);

  persistKey = input<string | null>(null);
  persistFilters = input<boolean>(false);

  ariaLabel = input<string>('Barra de filtros');
  ariaDescribedBy = input<string>('');
  clearButtonAriaLabel = input<string>('Limpar todos os filtros');
  applyButtonAriaLabel = input<string>('Aplicar filtros');

  clear = output<void>();
  apply = output<void>();
  filtersRestored = output<Record<string, unknown>>();

  private isMobile = signal<boolean>(false);

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

  constructor() {
    effect((onCleanup) => {
      if (typeof window !== 'undefined') {
        const checkMobile = () => {
          this.isMobile.set(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        onCleanup(() => window.removeEventListener('resize', checkMobile));
      }
    });

    effect(() => {
      if (this.persistFilters() && this.persistKey()) {
        this.restoreFilters();
      }
    });
  }

  getButtonSize(): 'small' | 'medium' | 'large' {
    const sizeMap: Record<OsFilterBarSize, 'small' | 'medium' | 'large'> = {
      small: 'small',
      medium: 'medium',
      large: 'large',
    };
    return sizeMap[this.size()];
  }

  onClear(): void {
    if (this.persistFilters() && this.persistKey()) {
      this.clearPersistedFilters();
    }
    this.clear.emit();
  }

  onApply(): void {
    this.apply.emit();
  }

  saveFilters(filters: Record<string, unknown>): void {
    if (!this.persistFilters() || !this.persistKey() || typeof window === 'undefined') {
      return;
    }

    try {
      const key = this.getStorageKey();
      const storage = this.getLocalStorage();
      if (!storage) return;
      storage.setItem(key, JSON.stringify(filters));
    } catch (error) {
      console.warn('Falha ao persistir filtros:', error);
    }
  }

  restoreFilters(): void {
    if (!this.persistFilters() || !this.persistKey() || typeof window === 'undefined') {
      return;
    }

    try {
      const key = this.getStorageKey();
      const storage = this.getLocalStorage();
      if (!storage) return;
      const stored = storage.getItem(key);

      if (stored) {
        const filters = JSON.parse(stored) as Record<string, unknown>;
        this.filtersRestored.emit(filters);
      }
    } catch (error) {
      console.warn('Falha ao restaurar filtros:', error);
    }
  }

  clearPersistedFilters(): void {
    if (!this.persistKey() || typeof window === 'undefined') {
      return;
    }

    try {
      const key = this.getStorageKey();
      const storage = this.getLocalStorage();
      if (!storage) return;
      storage.removeItem(key);
    } catch (error) {
      console.warn('Falha ao limpar filtros persistidos:', error);
    }
  }

  private getStorageKey(): string {
    return `os-filter-bar:${this.persistKey()}`;
  }

  private getLocalStorage(): Storage | null {
    try {
      if (typeof window === 'undefined') return null;
      return window.localStorage ?? null;
    } catch {
      
      return null;
    }
  }
}
