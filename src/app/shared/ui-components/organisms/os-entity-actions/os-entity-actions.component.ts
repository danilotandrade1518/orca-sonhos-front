import { Component, input, output, ChangeDetectionStrategy, computed } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { OsIconComponent } from '../../atoms/os-icon/os-icon.component';
import { OsIconMenuButtonComponent } from '../../atoms/os-icon-menu-button/os-icon-menu-button.component';
import type { OsEntityCardAction } from '../os-entity-card/os-entity-card.component';

export type OsEntityActionsSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'os-entity-actions',
  standalone: true,
  imports: [MatButtonModule, MatMenuModule, MatIconModule, OsIconComponent, OsIconMenuButtonComponent],
  template: `
    <div class="os-entity-actions">
      <os-icon-menu-button
        [menu]="actionsMenu"
        [disabled]="disabled()"
        [class]="buttonClasses()"
        [ariaLabel]="ariaLabel()"
        [size]="menuButtonSize()"
        [icon]="'more_vert'"
        (click)="$event.stopPropagation()"
      />

      <mat-menu #actionsMenu="matMenu" class="os-entity-actions__menu">
        @for (action of actions(); track action.id) {
        <button
          mat-menu-item
          [disabled]="action.disabled || disabled()"
          [class.os-entity-actions__menu-item--danger]="action.variant === 'danger'"
          (click)="onActionClick(action); $event.stopPropagation()"
        >
          @if (action.icon) {
          <os-icon [name]="action.icon" [size]="'sm'" [ariaHidden]="true" />
          }
          <span>{{ action.label }}</span>
        </button>
        }
      </mat-menu>
    </div>
  `,
  styleUrl: './os-entity-actions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'os-entity-actions-host',
  },
})
export class OsEntityActionsComponent {
  actions = input.required<OsEntityCardAction[]>();
  size = input<OsEntityActionsSize>('medium');
  disabled = input(false);
  menuOpen = input(false);
  ariaLabel = input<string>('Mais ações');

  actionClick = output<OsEntityCardAction>();

  buttonClasses = computed(() => {
    const classes = ['os-entity-actions__button'];
    if (this.size() !== 'medium') {
      classes.push(`os-entity-actions__button--${this.size()}`);
    }
    return classes.join(' ');
  });

  getIconSize = computed(() => {
    const sizeMap: Record<OsEntityActionsSize, 'sm' | 'md'> = {
      small: 'sm',
      medium: 'md',
      large: 'md',
    };
    return sizeMap[this.size()];
  });

  menuButtonSize = computed(() => {
    const sizeMap: Record<OsEntityActionsSize, 'small' | 'medium'> = {
      small: 'small',
      medium: 'medium',
      large: 'medium',
    };
    return sizeMap[this.size()];
  });

  onActionClick(action: OsEntityCardAction): void {
    if (!action.disabled && !this.disabled()) {
      this.actionClick.emit(action);
    }
  }
}
