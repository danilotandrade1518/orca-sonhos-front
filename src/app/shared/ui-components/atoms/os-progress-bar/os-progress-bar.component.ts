import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'os-progress-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="os-progress-bar" [class]="progressBarClasses()">
      @if (label()) {
      <div class="os-progress-bar__label">
        <span class="os-progress-bar__text">{{ label() }}</span>
        @if (showPercentage()) {
        <span class="os-progress-bar__percentage">{{ percentage() }}%</span>
        }
      </div>
      }
      <div class="os-progress-bar__track">
        <div
          class="os-progress-bar__fill"
          [style.width.%]="percentage()"
          [class]="fillClasses()"
        ></div>
      </div>
      @if (hint()) {
      <div class="os-progress-bar__hint">{{ hint() }}</div>
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

  readonly percentage = computed(() => {
    const value = this.value();
    const max = this.max();
    return Math.min(Math.max((value / max) * 100, 0), 100);
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

  readonly fillClasses = computed(() => {
    const classes = ['os-progress-bar__fill'];

    if (this.animated()) {
      classes.push('os-progress-bar__fill--animated');
    }

    if (this.striped()) {
      classes.push('os-progress-bar__fill--striped');
    }

    return classes.join(' ');
  });
}

