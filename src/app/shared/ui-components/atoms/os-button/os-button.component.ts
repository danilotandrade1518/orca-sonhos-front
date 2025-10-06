import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'os-button',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      [class]="buttonClasses()"
      [disabled]="disabled() || loading()"
      (click)="handleClick()"
    >
      @if (loading()) {
      <span class="os-button__spinner"></span>
      }
      <span class="os-button__content">
        <ng-content></ng-content>
      </span>
    </button>
  `,
  styles: [
    `
      :host {
        display: inline-block;
      }

      .os-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        font-family: inherit;
        font-weight: 500;
        border: none;
        border-radius: 0.375rem;
        cursor: pointer;
        transition: all 0.2s ease-in-out;

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        &:not(:disabled):hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        &:not(:disabled):active {
          transform: translateY(0);
        }
      }

      .os-button--small {
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
      }

      .os-button--medium {
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
      }

      .os-button--large {
        padding: 1rem 2rem;
        font-size: 1.125rem;
      }

      .os-button--primary {
        background-color: #3b82f6;
        color: white;

        &:not(:disabled):hover {
          background-color: #2563eb;
        }
      }

      .os-button--secondary {
        background-color: #64748b;
        color: white;

        &:not(:disabled):hover {
          background-color: #475569;
        }
      }

      .os-button--tertiary {
        background-color: transparent;
        color: #3b82f6;
        border: 1px solid #3b82f6;

        &:not(:disabled):hover {
          background-color: #eff6ff;
        }
      }

      .os-button--danger {
        background-color: #ef4444;
        color: white;

        &:not(:disabled):hover {
          background-color: #dc2626;
        }
      }

      .os-button__spinner {
        display: inline-block;
        width: 1rem;
        height: 1rem;
        border: 2px solid currentColor;
        border-right-color: transparent;
        border-radius: 50%;
        animation: spin 0.6s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      .os-button__content {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
      }
    `,
  ],
})
export class OsButtonComponent {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('medium');
  readonly disabled = input(false);
  readonly loading = input(false);
  readonly type = input<'button' | 'submit' | 'reset'>('button');

  readonly clicked = output<void>();

  buttonClasses(): string {
    return `os-button os-button--${this.variant()} os-button--${this.size()}`;
  }

  handleClick(): void {
    if (!this.disabled() && !this.loading()) {
      this.clicked.emit();
    }
  }
}
