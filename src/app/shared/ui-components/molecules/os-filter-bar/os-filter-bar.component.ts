import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
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

@Component({
  selector: 'os-filter-bar',
  standalone: true,
  imports: [CommonModule, OsButtonComponent],
  template: `
    <div class="os-filter-bar" [class]="filterBarClasses()">
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

  clear = output<void>();
  apply = output<void>();

  // Mapeamento interno para Atoms
  protected getButtonSize = () => {
    const sizeMap: Record<OsFilterBarSize, 'small' | 'medium' | 'large'> = {
      small: 'small',
      medium: 'medium',
      large: 'large',
    };
    return sizeMap[this.size()];
  };

  filterBarClasses = () => {
    const classes = ['os-filter-bar'];

    if (this.variant() !== 'default') {
      classes.push(`os-filter-bar--${this.variant()}`);
    }

    if (this.size() !== 'medium') {
      classes.push(`os-filter-bar--${this.size()}`);
    }

    return classes.join(' ');
  };

  onClear(): void {
    this.clear.emit();
  }

  onApply(): void {
    this.apply.emit();
  }
}
