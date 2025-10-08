import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'os-chip',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="os-chip"
      [class]="chipClasses()"
      (click)="onClick()"
      (keydown)="onKeyDown($event)"
      tabindex="0"
    >
      @if (icon()) {
      <span class="os-chip__icon">{{ icon() }}</span>
      }
      <span class="os-chip__text">{{ text() }}</span>
      @if (removable()) {
      <button
        type="button"
        class="os-chip__remove"
        (click)="onRemove($event)"
        [attr.aria-label]="removeLabel()"
      >
        <span class="os-chip__remove-icon">×</span>
      </button>
      }
    </div>
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

  onRemove(event: Event): void {
    event.stopPropagation();
    if (!this.disabled()) {
      this.removed.emit();
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onClick();
    }
  }
}
