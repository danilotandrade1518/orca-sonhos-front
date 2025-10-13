import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'os-progress-bar',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule],
  template: `
    <div
      class="os-progress-bar"
      [class]="progressBarClasses()"
      role="progressbar"
      [attr.aria-valuenow]="value()"
      [attr.aria-valuemin]="0"
      [attr.aria-valuemax]="max()"
      [attr.aria-label]="computedAriaLabel()"
    >
      @if (label()) {
      <div class="os-progress-bar__label">
        <span class="os-progress-bar__text">{{ label() }}</span>
        @if (showPercentage()) {
        <span class="os-progress-bar__percentage">{{ percentage() }}%</span>
        }
      </div>
      }

      <div class="os-progress-bar__container">
        <mat-progress-bar
          [mode]="mode()"
          [value]="percentage()"
          [bufferValue]="bufferValue()"
          [color]="matColor()"
          [class]="progressBarClass()"
        ></mat-progress-bar>
      </div>

      @if (hint()) {
      <div class="os-progress-bar__hint">{{ hint() }}</div>
      } @if (showCelebration() && isCompleted()) {
      <div class="os-progress-bar__celebration">{{ celebrationText() }}</div>
      }
    </div>
  `,
  styleUrls: ['./os-progress-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OsProgressBarComponent {
  readonly value = input(0);
  readonly max = input(100);
  readonly label = input<string | null>(null);
  readonly hint = input<string | null>(null);
  readonly showPercentage = input(true);
  readonly size = input<'small' | 'medium' | 'large'>('medium');
  readonly variant = input<'primary' | 'secondary' | 'success' | 'warning' | 'danger'>('primary');
  readonly animated = input(false);
  readonly striped = input(false);
  readonly bufferValue = input<number | null>(null);
  readonly ariaLabel = input<string | null>(null);
  readonly showCelebration = input(false);
  readonly celebrationText = input('🎉 Concluído!');

  readonly percentage = computed(() => {
    const value = this.value();
    const max = this.max();
    return Math.min(Math.max((value / max) * 100, 0), 100);
  });

  readonly mode = computed(() => {
    return this.bufferValue() !== null ? 'buffer' : 'determinate';
  });

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
      default:
        return undefined;
    }
  });

  readonly progressBarClasses = computed(() => {
    const classes = ['os-progress-bar'];
    classes.push(`os-progress-bar--${this.size()}`);
    classes.push(`os-progress-bar--${this.variant()}`);

    if (this.animated()) {
      classes.push('os-progress-bar--animated');
    }

    if (this.striped()) {
      classes.push('os-progress-bar--striped');
    }

    return classes.join(' ');
  });

  readonly progressBarClass = computed(() => {
    const classes = ['os-progress-bar__material'];
    classes.push(`os-progress-bar__material--${this.size()}`);

    if (this.animated()) {
      classes.push('os-progress-bar__material--animated');
    }

    if (this.striped()) {
      classes.push('os-progress-bar__material--striped');
    }

    return classes.join(' ');
  });

  readonly isCompleted = computed(() => {
    return this.percentage() >= 100;
  });

  readonly computedAriaLabel = computed(() => {
    if (this.ariaLabel()) {
      return this.ariaLabel();
    }

    const label = this.label() || 'Progresso';
    const percentage = this.percentage();
    return `${label}: ${percentage}% completo`;
  });
}
