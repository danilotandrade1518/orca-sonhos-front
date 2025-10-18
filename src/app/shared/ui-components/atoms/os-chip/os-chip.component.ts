import { Component, input, output, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';

export type OsChipSize = 'small' | 'medium' | 'large';
export type OsChipVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral';

@Component({
  selector: 'os-chip',
  standalone: true,
  imports: [CommonModule, MatChipsModule],
  template: `
    <mat-chip
      [id]="chipId"
      [class]="chipClasses()"
      [disabled]="disabled()"
      [removable]="removable()"
      [color]="matColor()"
      [attr.aria-label]="ariaLabel() || text()"
      [attr.aria-describedby]="ariaDescribedBy()"
      [attr.aria-pressed]="selected() ? 'true' : 'false'"
      [attr.role]="role()"
      [attr.tabindex]="disabled() ? -1 : 0"
      (click)="onClick()"
      (removed)="onRemove()"
      (mouseenter)="onMouseEnter()"
      (mouseleave)="onMouseLeave()"
      (focus)="onFocus($event)"
      (blur)="onBlur($event)"
    >
      @if (icon()) {
      <span class="os-chip__icon" [attr.aria-hidden]="true">{{ icon() }}</span>
      }
      <span class="os-chip__text">{{ text() }}</span>
      @if (removable()) {
      <button
        class="os-chip__remove"
        [attr.aria-label]="removeLabel()"
        [attr.aria-describedby]="chipId + '-remove-help'"
        (click)="onRemoveClick($event)"
      >
        <span class="os-chip__remove-icon" [attr.aria-hidden]="true">×</span>
      </button>
      }
    </mat-chip>
    @if (removable()) {
    <span [id]="chipId + '-remove-help'" class="os-chip__remove-help" [attr.aria-hidden]="true">
      {{ removeLabel() }}
    </span>
    }
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
  readonly size = input<OsChipSize>('medium');
  readonly variant = input<OsChipVariant>('neutral');
  readonly removeLabel = input('Remove');
  readonly ariaLabel = input<string>('');
  readonly ariaDescribedBy = input<string>('');
  readonly role = input<'button' | 'option' | 'tab'>('button');
  readonly animated = input(true);
  readonly hapticFeedback = input(true);

  readonly clicked = output<void>();
  readonly removed = output<void>();
  readonly focusEvent = output<FocusEvent>();
  readonly blurEvent = output<FocusEvent>();

  chipId = `os-chip-${Math.random().toString(36).substr(2, 9)}`;
  isFocused = signal(false);
  isHovered = signal(false);

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

    if (this.isFocused()) {
      classes.push('os-chip--focused');
    }

    if (this.isHovered()) {
      classes.push('os-chip--hovered');
    }

    if (this.animated()) {
      classes.push('os-chip--animated');
    }

    return classes.join(' ');
  });

  onClick(): void {
    if (!this.disabled()) {
      this.triggerHapticFeedback();
      this.clicked.emit();
    }
  }

  onRemove(): void {
    if (!this.disabled()) {
      this.triggerHapticFeedback();
      this.removed.emit();
    }
  }

  onRemoveClick(event: Event): void {
    event.stopPropagation();
    this.onRemove();
  }

  onMouseEnter(): void {
    this.isHovered.set(true);
  }

  onMouseLeave(): void {
    this.isHovered.set(false);
  }

  onFocus(event: FocusEvent): void {
    this.isFocused.set(true);
    this.focusEvent.emit(event);
  }

  onBlur(event: FocusEvent): void {
    this.isFocused.set(false);
    this.blurEvent.emit(event);
  }

  triggerHapticFeedback(): void {
    if (this.hapticFeedback() && 'vibrate' in navigator) {
      navigator.vibrate(50); // 50ms vibration
    }
  }

  // Mapeamento interno para Material
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
      case 'neutral':
        return undefined;
      default:
        return undefined;
    }
  });
}
