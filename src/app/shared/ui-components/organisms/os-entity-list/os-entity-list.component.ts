import { Component, input, output, ChangeDetectionStrategy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OsButtonComponent } from '../../atoms/os-button/os-button.component';
import { OsSpinnerComponent } from '../../atoms/os-spinner/os-spinner.component';
import { OsIconComponent } from '../../atoms/os-icon/os-icon.component';

export type OsEntityListLayout = 'grid' | 'list';
export type OsEntityListSize = 'small' | 'medium' | 'large';
export type OsEntityListVariant = 'default' | 'compact';

@Component({
  selector: 'os-entity-list',
  standalone: true,
  imports: [CommonModule, OsButtonComponent, OsSpinnerComponent, OsIconComponent],
  template: `
    <div
      class="os-entity-list"
      [class]="listClasses()"
      [attr.role]="'list'"
      [attr.aria-label]="ariaLabel()"
    >
      @if (isLoading()) {
      <div class="os-entity-list__loading" role="status" aria-live="polite">
        <os-spinner [variant]="'default'" [size]="getSpinnerSize()" />
        <p class="os-entity-list__loading-text">{{ loadingText() }}</p>
      </div>
      } @else if (isEmpty()) {
      <div class="os-entity-list__empty" role="status" aria-live="polite">
        @if (emptyIcon()) {
        <os-icon [name]="emptyIcon()" [size]="'lg'" />
        } @if (emptyTitle()) {
        <h3 class="os-entity-list__empty-title">{{ emptyTitle() }}</h3>
        } @if (emptyText()) {
        <p class="os-entity-list__empty-text">{{ emptyText() }}</p>
        } @if (emptyAction()) {
        <os-button
          [variant]="'primary'"
          [size]="getButtonSize()"
          [icon]="emptyActionIcon()"
          (buttonClick)="onEmptyAction()"
          [attr.aria-label]="emptyActionLabel()"
        >
          {{ emptyActionLabel() }}
        </os-button>
        }
      </div>
      } @else {
      <div class="os-entity-list__container" [class]="containerClasses()">
        <ng-content></ng-content>
      </div>
      }
    </div>
  `,
  styleUrl: './os-entity-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'os-entity-list-host',
  },
})
export class OsEntityListComponent {
  layout = input<OsEntityListLayout>('grid');
  size = input<OsEntityListSize>('medium');
  variant = input<OsEntityListVariant>('default');
  isLoading = input(false);
  isEmpty = input(false);
  loadingText = input('Carregando...');
  emptyTitle = input<string | null>(null);
  emptyText = input<string | null>(null);
  emptyIcon = input<string>('list');
  emptyAction = input<boolean>(false);
  emptyActionLabel = input('Adicionar');
  emptyActionIcon = input<string>('plus');
  ariaLabel = input<string>('Lista de entidades');

  emptyActionClick = output<void>();

  listClasses = computed(() => {
    const classes = ['os-entity-list'];
    if (this.layout() !== 'grid') {
      classes.push(`os-entity-list--${this.layout()}`);
    }
    if (this.size() !== 'medium') {
      classes.push(`os-entity-list--${this.size()}`);
    }
    if (this.variant() !== 'default') {
      classes.push(`os-entity-list--${this.variant()}`);
    }
    return classes.join(' ');
  });

  containerClasses = computed(() => {
    const classes = ['os-entity-list__container'];
    classes.push(`os-entity-list__container--${this.layout()}`);
    if (this.variant() !== 'default') {
      classes.push(`os-entity-list__container--${this.variant()}`);
    }
    return classes.join(' ');
  });

  getSpinnerSize = computed(() => {
    const sizeMap: Record<OsEntityListSize, 'sm' | 'md' | 'lg'> = {
      small: 'sm',
      medium: 'md',
      large: 'lg',
    };
    return sizeMap[this.size()];
  });

  getButtonSize = computed(() => {
    const sizeMap: Record<OsEntityListSize, 'small' | 'medium'> = {
      small: 'small',
      medium: 'medium',
      large: 'medium',
    };
    return sizeMap[this.size()];
  });

  onEmptyAction(): void {
    this.emptyActionClick.emit();
  }
}
