import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OsIconComponent } from '../../atoms/os-icon/os-icon.component';

export type ReportSummaryCardVariant = 'positive' | 'negative' | 'neutral';

@Component({
  selector: 'os-report-summary-card',
  standalone: true,
  imports: [CommonModule, OsIconComponent],
  template: `
    <article
      [class]="cardClasses()"
      [attr.role]="'article'"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-describedby]="labelId()"
    >
      <div class="os-report-summary-card__content">
        @if (icon()) {
        <div class="os-report-summary-card__icon">
          <os-icon [name]="icon()" [size]="'lg'" [variant]="iconVariant()" [ariaHidden]="true" />
        </div>
        }

        <div class="os-report-summary-card__info">
          @if (label()) {
          <p [id]="labelId()" class="os-report-summary-card__label">{{ label() }}</p>
          }

          <div class="os-report-summary-card__value-wrapper">
            <span class="os-report-summary-card__value">{{ value() }}</span>
            @if (change()) {
            <span [class]="changeClasses()" class="os-report-summary-card__change">
              @if (changeIcon(); as iconName) {
              <os-icon [name]="iconName" [size]="'sm'" [ariaHidden]="true" />
              }
              {{ change() }}
            </span>
            }
          </div>
        </div>
      </div>
    </article>
  `,
  styleUrl: './report-summary-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'os-report-summary-card-host',
  },
})
export class ReportSummaryCardComponent {
  label = input<string>('');
  value = input<string>('');
  change = input<string>('');
  variant = input<ReportSummaryCardVariant>('neutral');
  icon = input<string>('');
  ariaLabel = input<string | null>(null);

  private readonly uniqueId = `report-summary-card-${Math.random().toString(36).substr(2, 9)}`;

  labelId = computed(() => {
    return this.label() ? `${this.uniqueId}-label` : null;
  });

  cardClasses = computed(() => {
    const classes = ['os-report-summary-card'];
    classes.push(`os-report-summary-card--${this.variant()}`);
    return classes.join(' ');
  });

  changeClasses = computed(() => {
    const classes = ['os-report-summary-card__change'];
    classes.push(`os-report-summary-card__change--${this.variant()}`);
    return classes.join(' ');
  });

  iconVariant = computed(() => {
    switch (this.variant()) {
      case 'positive':
        return 'success';
      case 'negative':
        return 'error';
      default:
        return 'default';
    }
  });

  changeIcon = computed(() => {
    switch (this.variant()) {
      case 'positive':
        return 'trending-up';
      case 'negative':
        return 'trending-down';
      default:
        return null;
    }
  });
}

