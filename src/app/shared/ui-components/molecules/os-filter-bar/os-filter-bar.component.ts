import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export type OsFilterBarVariant = 'default' | 'compact' | 'expanded';
export type OsFilterBarSize = 'small' | 'medium' | 'large';

export interface OsFilterOption {
  key: string;
  label: string;
  value: any;
  type: 'text' | 'select' | 'date' | 'number';
  options?: { value: any; label: string }[];
}

@Component({
  selector: 'os-filter-bar',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <div class="os-filter-bar" [class]="filterBarClasses()">
      <div class="os-filter-bar__content">
        <ng-content></ng-content>
      </div>

      @if (showActions()) {
      <div class="os-filter-bar__actions">
        @if (showClearButton()) {
        <button
          mat-button
          class="os-filter-bar__clear"
          (click)="onClear()"
          [disabled]="!hasActiveFilters()"
        >
          <mat-icon>clear</mat-icon>
          {{ clearButtonText() }}
        </button>
        } @if (showApplyButton()) {
        <button
          mat-raised-button
          class="os-filter-bar__apply"
          (click)="onApply()"
          [disabled]="!hasActiveFilters()"
        >
          <mat-icon>check</mat-icon>
          {{ applyButtonText() }}
        </button>
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
