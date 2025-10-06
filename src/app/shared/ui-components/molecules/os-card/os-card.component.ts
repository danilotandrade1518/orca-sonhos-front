import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type CardVariant = 'default' | 'outlined' | 'elevated';

@Component({
  selector: 'os-card',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="cardClasses()">
      @if (title()) {
      <div class="os-card__header">
        <h3 class="os-card__title">{{ title() }}</h3>
        @if (subtitle()) {
        <p class="os-card__subtitle">{{ subtitle() }}</p>
        }
      </div>
      }
      <div class="os-card__content">
        <ng-content></ng-content>
      </div>
      @if (hasFooterContent()) {
      <div class="os-card__footer">
        <ng-content select="[footer]"></ng-content>
      </div>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .os-card {
        background-color: white;
        border-radius: 0.5rem;
        overflow: hidden;
        transition: all 0.2s ease-in-out;
      }

      .os-card--default {
        border: 1px solid #e5e7eb;
      }

      .os-card--outlined {
        border: 2px solid #3b82f6;
      }

      .os-card--elevated {
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

        &:hover {
          box-shadow: 0 10px 15px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }
      }

      .os-card__header {
        padding: 1.5rem;
        border-bottom: 1px solid #e5e7eb;
      }

      .os-card__title {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 600;
        color: #111827;
      }

      .os-card__subtitle {
        margin: 0.5rem 0 0;
        font-size: 0.875rem;
        color: #6b7280;
      }

      .os-card__content {
        padding: 1.5rem;
      }

      .os-card__footer {
        padding: 1rem 1.5rem;
        border-top: 1px solid #e5e7eb;
        background-color: #f9fafb;
      }
    `,
  ],
})
export class OsCardComponent {
  readonly title = input<string>();
  readonly subtitle = input<string>();
  readonly variant = input<CardVariant>('default');

  cardClasses(): string {
    return `os-card os-card--${this.variant()}`;
  }

  hasFooterContent(): boolean {
    // This will be determined by content projection
    return true;
  }
}
