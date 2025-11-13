import { Component, input, output, ChangeDetectionStrategy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OsEmptyStateComponent } from '../../molecules/os-empty-state/os-empty-state.component';
import { OsSkeletonComponent } from '../../atoms/os-skeleton/os-skeleton.component';

export type OsEntityListLayout = 'grid' | 'list';
export type OsEntityListSize = 'small' | 'medium' | 'large';
export type OsEntityListVariant = 'default' | 'compact';

@Component({
  selector: 'os-entity-list',
  standalone: true,
  imports: [CommonModule, OsEmptyStateComponent, OsSkeletonComponent],
  template: `
    <div
      class="os-entity-list"
      [class]="listClasses()"
      [attr.role]="'list'"
      [attr.aria-label]="ariaLabel()"
    >
      @if (isLoading()) {
      <div class="os-entity-list__loading" role="status" aria-live="polite" [attr.aria-busy]="'true'">
        <div class="os-entity-list__skeleton-container" [class]="containerClasses()">
          @for (item of skeletonItems(); track $index) {
          <os-skeleton [variant]="'card'" [size]="getSkeletonSize()" />
          }
        </div>
        <p class="os-entity-list__loading-text" aria-hidden="true">{{ loadingText() }}</p>
      </div>
      } @else if (isEmpty()) {
      <os-empty-state
        [size]="getEmptyStateSize()"
        [icon]="emptyIcon()"
        [title]="emptyTitle()"
        [message]="emptyText()"
        [showAction]="emptyAction()"
        [actionLabel]="emptyActionLabel()"
        [actionIcon]="emptyActionIcon()"
        [actionVariant]="'primary'"
        [actionSize]="getButtonSize()"
        [ariaLabel]="ariaLabel() + ' - Estado vazio'"
        [ariaLive]="'polite'"
        (actionClick)="onEmptyAction()"
      />
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

  skeletonItems = computed(() => {
    const countMap: Record<OsEntityListSize, number> = {
      small: 4,
      medium: 6,
      large: 8,
    };
    return Array(countMap[this.size()]).fill(0);
  });

  getSkeletonSize = computed(() => {
    const sizeMap: Record<OsEntityListSize, 'sm' | 'md' | 'lg'> = {
      small: 'sm',
      medium: 'md',
      large: 'lg',
    };
    return sizeMap[this.size()];
  });

  getEmptyStateSize = computed(() => {
    const sizeMap: Record<OsEntityListSize, 'small' | 'medium' | 'large'> = {
      small: 'small',
      medium: 'medium',
      large: 'large',
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
