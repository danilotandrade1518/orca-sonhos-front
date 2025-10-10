import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'os-chip',
  standalone: true,
  imports: [CommonModule, MatChipsModule],
  template: `
    <mat-chip
      [class]="chipClasses()"
      [disabled]="disabled()"
      [removable]="removable()"
      [color]="matColor()"
      (click)="onClick()"
      (removed)="onRemove()"
    >
      @if (icon()) {
      <span class="os-chip__icon">{{ icon() }}</span>
      }
      <span class="os-chip__text">{{ text() }}</span>
    </mat-chip>
  `,
  styleUrls: ['./os-chip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OsChipComponent {
  readonly text = input<string>('');
  readonly icon = input<string | null>(null);
  readonly removable = input(false);
  readonly disabled = input(false);
  readonly selected = input(false);
  readonly size = input<'small' | 'medium' | 'large'>('medium');
  readonly variant = input<'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral'>(
    'neutral'
  );
  readonly removeLabel = input('Remove');

  readonly clicked = output<void>();
  readonly removed = output<void>();

  readonly chipClasses = computed(() => {
    const classes = ['os-chip'];
    classes.push(`os-chip--${this.size()}`);
    classes.push(`os-chip--${this.variant()}`);

    if (this.disabled()) {
      classes.push('os-chip--disabled');
    }

    if (this.selected()) {
      classes.push('os-chip--selected');
    }

    if (this.removable()) {
      classes.push('os-chip--removable');
    }

    return classes.join(' ');
  });

  onClick(): void {
    if (!this.disabled()) {
      this.clicked.emit();
    }
  }

  onRemove(): void {
    if (!this.disabled()) {
      this.removed.emit();
    }
  }

  // Mapeamento interno para Material
  protected matColor = computed(() => {
    switch (this.variant()) {
      case 'primary':
        return 'primary';
      case 'secondary':
        return 'accent';
      case 'success':
        return 'primary';
      case 'warning':
        return 'warn';
      case 'danger':
        return 'warn';
      case 'neutral':
        return undefined;
      default:
        return undefined;
    }
  });
}
