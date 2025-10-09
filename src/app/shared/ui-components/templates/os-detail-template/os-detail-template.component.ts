import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { OsButtonComponent } from '../../atoms/os-button/os-button.component';
import { OsCardComponent } from '../../molecules/os-card/os-card.component';
import { OsPageHeaderComponent } from '../../organisms/os-page-header/os-page-header.component';

export interface DetailTemplateAction {
  id: string;
  label: string;
  variant: 'primary' | 'secondary' | 'tertiary' | 'danger';
  icon?: string;
  disabled?: boolean;
}

export interface DetailTemplateField {
  label: string;
  value: string | number | Date;
  type: 'text' | 'number' | 'date' | 'currency' | 'percentage';
  variant?: 'default' | 'highlight' | 'muted';
}

export interface DetailTemplateSection {
  title: string;
  fields: DetailTemplateField[];
  collapsible?: boolean;
  expanded?: boolean;
}

@Component({
  selector: 'os-detail-template',
  standalone: true,
  imports: [CommonModule, RouterModule, OsButtonComponent, OsCardComponent, OsPageHeaderComponent],
  template: `
    <div [class]="templateClass()">
      @if (showHeader()) {
      <os-page-header
        [title]="title()"
        [subtitle]="subtitle()"
        [variant]="headerVariant()"
        [size]="size()"
        [actions]="headerActions()"
        (actionClick)="handleHeaderActionClick($event)"
      />
      }

      <div class="os-detail-template__content">
        @for (section of sections(); track section.title) {
        <os-card [variant]="cardVariant()" [size]="size()" [class]="getSectionClass(section)">
          <div class="os-detail-template__section-header">
            <h3 class="os-detail-template__section-title">{{ section.title }}</h3>
            @if (section.collapsible) {
            <os-button
              variant="tertiary"
              size="small"
              [icon]="section.expanded ? 'chevron-up' : 'chevron-down'"
              (click)="toggleSection(section)"
            />
            }
          </div>

          @if (!section.collapsible || section.expanded) {
          <div class="os-detail-template__fields">
            @for (field of section.fields; track field.label) {
            <div class="os-detail-template__field">
              <label class="os-detail-template__field-label">{{ field.label }}</label>
              <div [class]="getFieldClass(field)">
                @switch (field.type) { @case ('currency') {
                <span class="os-detail-template__currency">
                  R$ {{ formatCurrency(field.value) }}
                </span>
                } @case ('percentage') {
                <span class="os-detail-template__percentage">
                  {{ formatPercentage(field.value) }}%
                </span>
                } @case ('date') {
                <span class="os-detail-template__date">
                  {{ formatDate(field.value) }}
                </span>
                } @default {
                <span class="os-detail-template__text">{{ field.value }}</span>
                } }
              </div>
            </div>
            }
          </div>
          }
        </os-card>
        }
      </div>

      @if (actions().length > 0) {
      <div class="os-detail-template__actions">
        @for (action of actions(); track action.id) {
        <os-button
          [variant]="action.variant"
          [size]="size()"
          [icon]="action.icon || ''"
          [disabled]="action.disabled || disabled()"
          (click)="onActionClick.emit(action)"
        >
          {{ action.label }}
        </os-button>
        }
      </div>
      }
    </div>
  `,
  styleUrls: ['./os-detail-template.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OsDetailTemplateComponent {
  variant = input<'default' | 'compact' | 'detailed'>('default');
  size = input<'small' | 'medium' | 'large'>('medium');
  theme = input<'light' | 'dark'>('light');
  disabled = input(false);
  loading = input(false);

  title = input<string>('');
  subtitle = input<string>('');
  showHeader = input(true);
  showBreadcrumb = input(false);
  breadcrumbItems = input<any[]>([]);
  headerActions = input<DetailTemplateAction[]>([]);

  sections = input<DetailTemplateSection[]>([]);
  actions = input<DetailTemplateAction[]>([]);

  onHeaderActionClick = output<{ action: DetailTemplateAction; event: MouseEvent }>();
  onActionClick = output<DetailTemplateAction>();
  onSectionToggle = output<{ section: DetailTemplateSection; expanded: boolean }>();

  protected templateClass = computed(() => {
    return [
      'os-detail-template',
      `os-detail-template--${this.variant()}`,
      `os-detail-template--${this.size()}`,
      `os-detail-template--${this.theme()}`,
      this.disabled() ? 'os-detail-template--disabled' : '',
      this.loading() ? 'os-detail-template--loading' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  public headerVariant = computed(() => {
    const sizeMap = {
      small: 'compact' as const,
      medium: 'default' as const,
      large: 'extended' as const,
    };
    return sizeMap[this.size()];
  });

  public cardVariant = computed(() => {
    const variantMap = {
      default: 'default' as const,
      compact: 'outlined' as const,
      detailed: 'elevated' as const,
    };
    return variantMap[this.variant()];
  });

  public getSectionClass(section: DetailTemplateSection): string {
    return [
      'os-detail-template__section',
      section.collapsible ? 'os-detail-template__section--collapsible' : '',
      section.expanded ? 'os-detail-template__section--expanded' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  public getFieldClass(field: DetailTemplateField): string {
    return [
      'os-detail-template__field-value',
      `os-detail-template__field-value--${field.variant || 'default'}`,
    ]
      .filter(Boolean)
      .join(' ');
  }

  public formatCurrency(value: string | number | Date): string {
    const numValue = typeof value === 'number' ? value : parseFloat(value.toString());
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numValue);
  }

  public formatPercentage(value: string | number | Date): string {
    const numValue = typeof value === 'number' ? value : parseFloat(value.toString());
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 2,
    }).format(numValue);
  }

  public formatDate(value: string | number | Date): string {
    const dateValue = value instanceof Date ? value : new Date(value);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(dateValue);
  }

  public toggleSection(section: DetailTemplateSection): void {
    if (section.collapsible) {
      section.expanded = !section.expanded;
      this.onSectionToggle.emit({ section, expanded: section.expanded });
    }
  }

  public handleHeaderActionClick(event: any): void {
    this.onHeaderActionClick.emit({ action: event, event: new MouseEvent('click') });
  }
}
