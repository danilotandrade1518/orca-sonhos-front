import { Component, computed, input, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'os-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="os-page" [class]="pageClasses()" [attr.aria-label]="ariaLabel()" role="main">
      <ng-content />
    </div>
  `,
  styleUrls: ['./os-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OsPageComponent {
  private readonly breakpointObserver = inject(BreakpointObserver);

  readonly variant = input<'default' | 'compact' | 'extended'>('default');
  readonly size = input<'small' | 'medium' | 'large'>('medium');
  readonly theme = input<'light' | 'dark'>('light');
  readonly ariaLabel = input<string | null>(null);
  readonly maxWidth = input<string | null>(null);

  readonly isMobile = signal(false);

  readonly pageClasses = computed(() => {
    const classes = ['os-page'];
    classes.push(`os-page--${this.variant()}`);
    classes.push(`os-page--${this.size()}`);

    if (this.theme() === 'dark') {
      classes.push('os-page--dark');
    }

    if (this.isMobile()) {
      classes.push('os-page--mobile');
    }

    return classes.join(' ');
  });

  constructor() {
    this.breakpointObserver.observe(['(max-width: 768px)']).subscribe((result) => {
      this.isMobile.set(result.matches);
    });
  }
}
