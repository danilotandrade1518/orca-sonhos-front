import { Component, computed, input, output, ChangeDetectionStrategy } from '@angular/core';
import { OsButtonComponent } from '../../atoms/os-button/os-button.component';

export interface PanelTemplateConfig {
  title: string;
  subtitle?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  showActions?: boolean;
  collapsible?: boolean;
  expanded?: boolean;
  actions?: {
    label: string;
    variant: 'primary' | 'secondary' | 'tertiary' | 'danger';
    size: 'small' | 'medium' | 'large';
    disabled?: boolean;
    loading?: boolean;
    icon?: string;
  }[];
}

@Component({
  selector: 'os-panel-template',
  template: `
    <div
      [class]="panelClass()"
      [attr.aria-label]="ariaLabel()"
      [attr.role]="'region'"
      [attr.aria-expanded]="config().collapsible ? isExpanded() : null"
      [attr.aria-labelledby]="panelTitleId()"
    >
      @if (config().showHeader ?? true) {
      <div class="os-panel-template__header" [class]="headerClass()">
        <div class="os-panel-template__header-content">
          <h3 class="os-panel-template__title" [id]="panelTitleId()">
            {{ config().title }}
          </h3>
          @if (config().subtitle) {
          <p class="os-panel-template__subtitle">{{ config().subtitle }}</p>
          }
        </div>
        @if (config().collapsible) {
        <os-button
          [variant]="'tertiary'"
          [size]="size()"
          [icon]="isExpanded() ? 'expand_less' : 'expand_more'"
          (click)="toggleExpanded()"
          [attr.aria-label]="isExpanded() ? 'Recolher painel' : 'Expandir painel'"
          [attr.aria-controls]="panelContentId()"
          [attr.aria-expanded]="isExpanded()"
        />
        }
      </div>
      } @if (!config().collapsible || isExpanded()) {
      <div
        class="os-panel-template__content"
        [class]="contentClass()"
        [id]="panelContentId()"
        [attr.aria-hidden]="config().collapsible ? !isExpanded() : null"
      >
        <ng-content />
      </div>
      } @if (config().showActions ?? true) {
      <div class="os-panel-template__actions" [class]="actionsClass()">
        @for (action of config().actions || []; track action.label) {
        <os-button
          [variant]="action.variant"
          [size]="action.size"
          [disabled]="action.disabled || disabled()"
          [loading]="action.loading || false"
          [icon]="action.icon || ''"
          (click)="onActionClick(action)"
          [attr.aria-label]="action.label"
        >
          {{ action.label }}
        </os-button>
        }
      </div>
      }
    </div>
  `,
  styleUrls: ['./os-panel-template.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OsButtonComponent],
})
export class OsPanelTemplateComponent {
  config = input.required<PanelTemplateConfig>();
  size = input<'small' | 'medium' | 'large'>('medium');
  variant = input<'default' | 'compact' | 'detailed'>('default');
  theme = input<'light' | 'dark'>('light');
  disabled = input(false);
  loading = input(false);
  expanded = input(true);

  actionClick = output<{
    label: string;
    variant: 'primary' | 'secondary' | 'tertiary' | 'danger';
    size: 'small' | 'medium' | 'large';
    disabled?: boolean;
    loading?: boolean;
    icon?: string;
  }>();
  toggled = output<boolean>();

  isExpanded = computed(() => {
    return this.expanded();
  });

  panelClass = computed(() => {
    return [
      'os-panel-template',
      `os-panel-template--${this.variant()}`,
      `os-panel-template--${this.size()}`,
      `os-panel-template--${this.theme()}`,
      this.disabled() ? 'os-panel-template--disabled' : '',
      this.loading() ? 'os-panel-template--loading' : '',
      this.isExpanded() ? 'os-panel-template--expanded' : 'os-panel-template--collapsed',
    ]
      .filter(Boolean)
      .join(' ');
  });

  headerClass = computed(() => {
    return [
      'os-panel-template__header',
      `os-panel-template__header--${this.variant()}`,
      `os-panel-template__header--${this.size()}`,
    ]
      .filter(Boolean)
      .join(' ');
  });

  contentClass = computed(() => {
    return [
      'os-panel-template__content',
      `os-panel-template__content--${this.variant()}`,
      `os-panel-template__content--${this.size()}`,
      this.disabled() ? 'os-panel-template__content--disabled' : '',
      this.loading() ? 'os-panel-template__content--loading' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  actionsClass = computed(() => {
    return [
      'os-panel-template__actions',
      `os-panel-template__actions--${this.variant()}`,
      `os-panel-template__actions--${this.size()}`,
    ]
      .filter(Boolean)
      .join(' ');
  });

  ariaLabel = computed(() => {
    return `Painel: ${this.config().title}`;
  });

  panelTitleId = computed(() => {
    return this.config().collapsible ? `panel-title-${this.generateId(this.config().title)}` : null;
  });

  panelContentId = computed(() => {
    return this.config().collapsible
      ? `panel-content-${this.generateId(this.config().title)}`
      : null;
  });

  private generateId = (text: string): string => {
    return text.replace(/\s+/g, '-').toLowerCase();
  };

  toggleExpanded(): void {
    const newExpanded = !this.isExpanded();
    this.toggled.emit(newExpanded);
  }

  onActionClick(action: {
    label: string;
    variant: 'primary' | 'secondary' | 'tertiary' | 'danger';
    size: 'small' | 'medium' | 'large';
    disabled?: boolean;
    loading?: boolean;
    icon?: string;
  }): void {
    if (action.disabled || this.disabled() || action.loading) {
      return;
    }

    this.actionClick.emit(action);
  }
}
