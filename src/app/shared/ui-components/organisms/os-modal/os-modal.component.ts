import {
  Component,
  input,
  output,
  computed,
  ChangeDetectionStrategy,
  inject,
  ElementRef,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { OsButtonComponent } from '../../atoms/os-button/os-button.component';
import { OsCardComponent } from '../../molecules/os-card/os-card.component';

export type OsModalVariant = 'default' | 'confirmation' | 'form' | 'info';
export type OsModalSize = 'small' | 'medium' | 'large' | 'fullscreen';

export interface OsModalAction {
  label: string;
  variant: 'primary' | 'secondary' | 'tertiary' | 'danger';
  action: () => void;
  disabled?: boolean;
  loading?: boolean;
}

@Component({
  selector: 'os-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, OsButtonComponent, OsCardComponent],
  template: `
    <div
      class="os-modal"
      [class]="modalClasses()"
      [attr.role]="'dialog'"
      [attr.aria-modal]="true"
      [attr.aria-labelledby]="titleId()"
      [attr.aria-describedby]="descriptionId()"
    >
      <div
        class="os-modal__backdrop"
        (click)="onBackdropClick()"
        (keydown.enter)="onBackdropClick()"
        tabindex="0"
        role="button"
        [attr.aria-label]="'Fechar modal clicando no fundo'"
      ></div>

      <div class="os-modal__container" [class]="containerClasses()">
        <os-card
          [variant]="cardVariant()"
          [size]="cardSize()"
          [header]="showHeader()"
          [actions]="showActions()"
        >
          @if (showHeader()) {
          <div slot="header" class="os-modal__header">
            @if (title()) {
            <h2 [id]="titleId()" class="os-modal__title">{{ title() }}</h2>
            } @if (subtitle()) {
            <p [id]="descriptionId()" class="os-modal__subtitle">{{ subtitle() }}</p>
            } @if (closable()) {
            <button
              class="os-modal__close"
              (click)="onClose()"
              [attr.aria-label]="'Fechar modal'"
              type="button"
            >
              <span class="os-modal__close-icon" aria-hidden="true">×</span>
            </button>
            }
          </div>
          }

          <div class="os-modal__content" [class]="contentClasses()">
            <ng-content></ng-content>
          </div>

          @if (showActions()) {
          <div slot="actions" class="os-modal__actions" [class]="actionsClasses()">
            @if (actions().length > 0) { @for (action of actions(); track action.label) {
            <os-button
              [variant]="action.variant"
              [size]="buttonSize()"
              [disabled]="action.disabled || false"
              [loading]="action.loading || false"
              (clicked)="action.action()"
            >
              {{ action.label }}
            </os-button>
            } } @else { @if (showDefaultActions()) {
            <os-button variant="secondary" [size]="buttonSize()" (clicked)="onClose()">
              {{ cancelText() }}
            </os-button>
            <os-button
              variant="primary"
              [size]="buttonSize()"
              [disabled]="confirmDisabled()"
              [loading]="confirmLoading()"
              (clicked)="onConfirm()"
            >
              {{ confirmText() }}
            </os-button>
            } }
          </div>
          }
        </os-card>
      </div>
    </div>
  `,
  styleUrls: ['./os-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'os-modal-host',
  },
})
export class OsModalComponent {
  // Input signals
  readonly title = input<string | null>(null);
  readonly subtitle = input<string | null>(null);
  readonly variant = input<OsModalVariant>('default');
  readonly size = input<OsModalSize>('medium');
  readonly closable = input<boolean>(true);
  readonly closeOnBackdrop = input<boolean>(true);
  readonly closeOnEscape = input<boolean>(true);
  readonly actions = input<OsModalAction[]>([]);
  readonly showDefaultActions = input<boolean>(false);
  readonly confirmText = input<string>('Confirmar');
  readonly cancelText = input<string>('Cancelar');
  readonly confirmDisabled = input<boolean>(false);
  readonly confirmLoading = input<boolean>(false);
  readonly fullHeight = input<boolean>(false);
  readonly centered = input<boolean>(true);

  // Output signals
  readonly closed = output<void>();
  readonly confirmed = output<void>();
  readonly backdropClicked = output<void>();

  // Private properties
  private readonly elementRef = inject(ElementRef);
  private readonly dialogRef = inject(MatDialogRef<OsModalComponent>, { optional: true });

  // Computed values
  readonly titleId = computed(() => `modal-title-${Math.random().toString(36).substr(2, 9)}`);
  readonly descriptionId = computed(
    () => `modal-description-${Math.random().toString(36).substr(2, 9)}`
  );

  readonly showHeader = computed(() => {
    return this.title() !== null || this.subtitle() !== null || this.closable();
  });

  readonly showActions = computed(() => {
    return this.actions().length > 0 || this.showDefaultActions();
  });

  readonly cardVariant = computed(() => {
    const variant = this.variant();
    switch (variant) {
      case 'confirmation':
        return 'outlined';
      case 'form':
        return 'elevated';
      case 'info':
        return 'flat';
      default:
        return 'default';
    }
  });

  readonly cardSize = computed(() => {
    const size = this.size();
    switch (size) {
      case 'small':
        return 'small';
      case 'large':
      case 'fullscreen':
        return 'large';
      default:
        return 'medium';
    }
  });

  readonly buttonSize = computed(() => {
    const size = this.size();
    switch (size) {
      case 'small':
        return 'small';
      case 'large':
      case 'fullscreen':
        return 'large';
      default:
        return 'medium';
    }
  });

  readonly modalClasses = computed(() => {
    const classes = ['os-modal'];
    classes.push(`os-modal--${this.variant()}`);
    classes.push(`os-modal--${this.size()}`);

    if (this.fullHeight()) {
      classes.push('os-modal--full-height');
    }

    if (this.centered()) {
      classes.push('os-modal--centered');
    }

    return classes.join(' ');
  });

  readonly containerClasses = computed(() => {
    const classes = ['os-modal__container'];
    classes.push(`os-modal__container--${this.size()}`);

    if (this.centered()) {
      classes.push('os-modal__container--centered');
    }

    return classes.join(' ');
  });

  readonly contentClasses = computed(() => {
    const classes = ['os-modal__content'];

    if (this.fullHeight()) {
      classes.push('os-modal__content--full-height');
    }

    return classes.join(' ');
  });

  readonly actionsClasses = computed(() => {
    const classes = ['os-modal__actions'];
    const actionCount = this.actions().length || (this.showDefaultActions() ? 2 : 0);

    if (actionCount > 2) {
      classes.push('os-modal__actions--multiple');
    } else {
      classes.push('os-modal__actions--dual');
    }

    return classes.join(' ');
  });

  // Event handlers
  onClose(): void {
    this.closed.emit();
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  onConfirm(): void {
    this.confirmed.emit();
  }

  onBackdropClick(): void {
    if (this.closeOnBackdrop()) {
      this.backdropClicked.emit();
      this.onClose();
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    if (this.closeOnEscape()) {
      keyboardEvent.preventDefault();
      this.onClose();
    }
  }

  @HostListener('document:keydown.enter', ['$event'])
  onEnterKey(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.ctrlKey || keyboardEvent.metaKey) {
      keyboardEvent.preventDefault();
      this.onConfirm();
    }
  }
}
