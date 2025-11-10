import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type OsSkeletonVariant = 'text' | 'rectangular' | 'circular' | 'card';
export type OsSkeletonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'os-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      [class]="skeletonClasses()"
      [style.width]="width() || undefined"
      [style.height]="height() || undefined"
      [attr.aria-hidden]="'true'"
      [attr.aria-label]="ariaLabel() || 'Loading content'"
    >
      <span class="os-skeleton__shimmer" aria-hidden="true"></span>
    </div>
  `,
  styleUrls: ['./os-skeleton.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'os-skeleton-host',
  },
})
export class OsSkeletonComponent {
  variant = input<OsSkeletonVariant>('text');
  size = input<OsSkeletonSize>('md');
  width = input<string | null>(null);
  height = input<string | null>(null);
  animated = input(true);
  ariaLabel = input<string | null>(null);

  skeletonClasses = computed(() => {
    const classes = ['os-skeleton'];
    classes.push(`os-skeleton--${this.variant()}`);
    classes.push(`os-skeleton--${this.size()}`);
    if (this.animated()) {
      classes.push('os-skeleton--animated');
    }
    return classes.join(' ');
  });
}
