import {
  Component,
  input,
  output,
  computed,
  ChangeDetectionStrategy,
  inject,
  ElementRef,
  HostListener,
  effect,
  signal,
  afterNextRender,
  DestroyRef,
} from '@angular/core';

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
  imports: [MatDialogModule, OsButtonComponent, OsCardComponent],
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
            <ng-content />
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
  readonly animated = input<boolean>(true);
  readonly hapticFeedback = input<boolean>(true);
  
  readonly closed = output<void>();
  readonly confirmed = output<void>();
  readonly backdropClicked = output<void>();
  readonly opened = output<void>();
  readonly animationEnd = output<'enter' | 'leave'>();
  
  private readonly elementRef = inject(ElementRef);
  private readonly dialogRef = inject(MatDialogRef<OsModalComponent>, { optional: true });
  private readonly destroyRef = inject(DestroyRef);
  
  private readonly isVisible = signal(false);
  private readonly isAnimating = signal(false);
  private readonly focusableElements: HTMLElement[] = [];
  private readonly previousActiveElement: HTMLElement | null = null;
  private isDestroyed = false;
  
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

    if (this.animated()) {
      classes.push('os-modal--animated');
    }

    if (this.isVisible()) {
      classes.push('os-modal--visible');
    }

    if (this.isAnimating()) {
      classes.push('os-modal--animating');
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

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.isDestroyed = true;
    });

    afterNextRender(() => {
      this.initializeModal();
    });

    effect(() => {
      if (this.isAnimating()) {
        this.handleAnimationEnd();
      }
    });
  }

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
  
  private initializeModal(): void {
    this.isVisible.set(true);
    this.onOpen();
    this.setupFocusTrap();
    this.animateIn();
  }

  private setupFocusTrap(): void {
    const modalElement = this.elementRef.nativeElement;
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ');

    this.focusableElements.length = 0;
    this.focusableElements.push(
      ...(Array.from(modalElement.querySelectorAll(focusableSelectors)) as HTMLElement[])
    );

    if (this.focusableElements.length > 0) {
      this.focusableElements[0].focus();
    }
  }

  private handleTabNavigation(event: KeyboardEvent): void {
    if (this.focusableElements.length === 0) return;

    const currentIndex = this.focusableElements.indexOf(document.activeElement as HTMLElement);

    if (event.shiftKey) {
      const nextIndex = currentIndex <= 0 ? this.focusableElements.length - 1 : currentIndex - 1;
      this.focusableElements[nextIndex].focus();
    } else {
      const nextIndex = currentIndex >= this.focusableElements.length - 1 ? 0 : currentIndex + 1;
      this.focusableElements[nextIndex].focus();
    }

    event.preventDefault();
  }

  private animateIn(): void {
    if (!this.animated()) {
      this.isVisible.set(true);
      return;
    }

    this.isAnimating.set(true);
    const modalElement = this.elementRef.nativeElement;
    modalElement.classList.add('os-modal--entering');

    setTimeout(() => {
      if (!this.isDestroyed) {
        modalElement.classList.remove('os-modal--entering');
        modalElement.classList.add('os-modal--entered');
        this.isAnimating.set(false);
      }
    }, 10);
  }

  private animateOut(): void {
    if (!this.animated()) {
      this.closeModal();
      return;
    }

    this.isAnimating.set(true);
    const modalElement = this.elementRef.nativeElement;
    modalElement.classList.add('os-modal--leaving');

    setTimeout(() => {
      if (!this.isDestroyed) {
        this.closeModal();
      }
    }, 300);
  }

  private closeModal(): void {
    if (!this.isDestroyed) {
      this.closed.emit();
      if (this.dialogRef) {
        this.dialogRef.close();
      }
    }
  }

  private handleAnimationEnd(): void {
    if (this.isDestroyed) return;

    const modalElement = this.elementRef.nativeElement;
    const isEntering = modalElement.classList.contains('os-modal--entering');
    const isLeaving = modalElement.classList.contains('os-modal--leaving');

    if (isEntering) {
      this.animationEnd.emit('enter');
    } else if (isLeaving) {
      this.animationEnd.emit('leave');
    }
  }

  private triggerHapticFeedback(): void {
    if (this.hapticFeedback() && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }
  
  onClose(): void {
    this.triggerHapticFeedback();
    this.animateOut();
  }

  onConfirm(): void {
    this.triggerHapticFeedback();
    this.confirmed.emit();
  }

  onOpen(): void {
    this.opened.emit();
  }

  onBackdropClick(): void {
    if (this.closeOnBackdrop()) {
      this.triggerHapticFeedback();
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

  @HostListener('document:keydown.tab', ['$event'])
  onTabKey(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    this.handleTabNavigation(keyboardEvent);
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
