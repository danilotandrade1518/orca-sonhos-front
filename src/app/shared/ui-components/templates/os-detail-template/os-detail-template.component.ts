import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  inject,
  signal,
  OnDestroy,
  effect,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';

import { OsButtonComponent } from '../../atoms/os-button/os-button.component';
import { OsCardComponent } from '../../molecules/os-card/os-card.component';
import { LocaleService } from '@shared/formatting';
import {
  OsNavigationComponent,
  NavigationItem,
} from '../../organisms/os-navigation/os-navigation.component';
import {
  OsPageHeaderComponent,
  PageHeaderAction,
} from '../../organisms/os-page-header/os-page-header.component';

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

export interface DetailTemplateTab {
  id: string;
  label: string;
  icon?: string;
  disabled?: boolean;
  badge?: number;
}

export interface DetailTemplateBreadcrumb {
  label: string;
  route?: string;
  disabled?: boolean;
}

@Component({
  selector: 'os-detail-template',
  standalone: true,
  imports: [
    RouterModule,
    OsButtonComponent,
    OsCardComponent,
    OsNavigationComponent,
    OsPageHeaderComponent
],
  template: `
    <div [class]="templateClass()" role="main" [attr.aria-label]="title()">
      @if (showHeader()) {
      <os-page-header
        [title]="title()"
        [subtitle]="subtitle()"
        [variant]="headerVariant()"
        [size]="size()"
        [breadcrumbs]="breadcrumbs()"
        [actions]="headerActions()"
        (actionClick)="handleHeaderActionClick($event)"
      />
      } @if (tabs().length > 0) {
      <div class="os-detail-template__tabs" role="tablist" [attr.aria-label]="tabsAriaLabel()">
        <os-navigation
          [items]="navigationItems"
          [variant]="navigationVariant"
          [size]="navigationSize"
          [orientation]="navigationOrientation"
          [activeItemId]="navigationActiveItemId"
          [ariaLabel]="tabsAriaLabel() || 'Navegação por abas'"
          (itemClick)="onTabClick($event)"
        />
      </div>
      }

      <div class="os-detail-template__content" [class]="contentClass()">
        @if (showSidebar() && !isMobile()) {
        <aside
          class="os-detail-template__sidebar"
          role="complementary"
          [attr.aria-label]="sidebarAriaLabel()"
        >
          <os-card [variant]="cardVariant()" [size]="size()">
            <div class="os-detail-template__sidebar-content">
              <ng-content select="[slot=sidebar]" />
            </div>
          </os-card>
        </aside>
        }

        <div class="os-detail-template__main" role="region" [attr.aria-label]="mainAriaLabel()">
          @for (section of sections(); track section.title) {
          <os-card [variant]="cardVariant()" [size]="size()" [class]="getSectionClass(section)">
            <div class="os-detail-template__section-header">
              <h3 class="os-detail-template__section-title">{{ section.title }}</h3>
              @if (section.collapsible) {
              <os-button
                variant="tertiary"
                size="small"
                [icon]="section.expanded ? 'chevron-up' : 'chevron-down'"
                [attr.aria-expanded]="section.expanded"
                [attr.aria-controls]="'section-' + section.title"
                (click)="toggleSection(section)"
              />
              }
            </div>

            @if (!section.collapsible || section.expanded) {
            <div class="os-detail-template__fields" [id]="'section-' + section.title">
              @for (field of section.fields; track field.label) {
              <div class="os-detail-template__field">
                <label [for]="'field-' + field.label" class="os-detail-template__field-label">{{
                  field.label
                }}</label>
                <div [id]="'field-' + field.label" [class]="getFieldClass(field)">
                  @switch (field.type) { @case ('currency') {
                  <span
                    class="os-detail-template__currency"
                    [attr.aria-label]="'Valor: ' + formatCurrency(field.value)"
                  >
                    R$ {{ formatCurrency(field.value) }}
                  </span>
                  } @case ('percentage') {
                  <span
                    class="os-detail-template__percentage"
                    [attr.aria-label]="'Percentual: ' + formatPercentage(field.value)"
                  >
                    {{ formatPercentage(field.value) }}%
                  </span>
                  } @case ('date') {
                  <span
                    class="os-detail-template__date"
                    [attr.aria-label]="'Data: ' + formatDate(field.value)"
                  >
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
      </div>

      @if (actions().length > 0) {
      <div class="os-detail-template__actions" role="group" [attr.aria-label]="actionsAriaLabel()">
        @for (action of actions(); track action.id) {
        <os-button
          [variant]="action.variant"
          [size]="actionSize()"
          [icon]="action.icon || ''"
          [disabled]="action.disabled || disabled()"
          [attr.aria-label]="action.label"
          (click)="actionClicked.emit(action)"
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
export class OsDetailTemplateComponent implements OnDestroy {
  private breakpointObserver = inject(BreakpointObserver);
  private isMobileSignal = signal(false);
  private breakpointSubscription?: Subscription;
  private readonly localeService = inject(LocaleService);

  variant = input<'default' | 'compact' | 'detailed'>('default');
  size = input<'small' | 'medium' | 'large'>('medium');
  theme = input<'light' | 'dark'>('light');
  disabled = input(false);
  loading = input(false);

  title = input<string>('');
  subtitle = input<string>('');
  showHeader = input(true);
  showBreadcrumb = input(false);
  breadcrumbs = input<DetailTemplateBreadcrumb[]>([]);
  headerActions = input<DetailTemplateAction[]>([]);

  sections = input<DetailTemplateSection[]>([]);
  actions = input<DetailTemplateAction[]>([]);
  tabs = input<DetailTemplateTab[]>([]);
  activeTabId = input<string | null>(null);
  showSidebar = input(false);
  sidebarAriaLabel = input<string>('Sidebar de informações adicionais');

  headerActionClicked = output<{ action: DetailTemplateAction; event: MouseEvent }>();
  actionClicked = output<DetailTemplateAction>();
  sectionToggled = output<{ section: DetailTemplateSection; expanded: boolean }>();
  tabChanged = output<{ tab: DetailTemplateTab; event: MouseEvent }>();

  constructor() {
    this.breakpointSubscription = this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe((result) => {
        this.isMobileSignal.set(result.matches);
      });

    effect(() => {
      const tabs = this.tabs();
      const activeTabId = this.activeTabId();

      this.navigationItems.set(
        tabs.map((tab) => ({
          id: tab.id,
          label: tab.label,
          icon: tab.icon || '',
          route: undefined,
          disabled: tab.disabled || false,
          badge: tab.badge || undefined,
          active: tab.id === activeTabId,
        }))
      );

      this.navigationActiveItemId.set(activeTabId);

      this.navigationSize.set('medium');
    });
  }

  ngOnDestroy(): void {
    this.breakpointSubscription?.unsubscribe();
  }

  isMobile = computed(() => this.isMobileSignal());

  protected templateClass = computed(() => {
    return [
      'os-detail-template',
      `os-detail-template--${this.variant()}`,
      `os-detail-template--${this.size()}`,
      `os-detail-template--${this.theme()}`,
      this.disabled() ? 'os-detail-template--disabled' : '',
      this.loading() ? 'os-detail-template--loading' : '',
      this.isMobile() ? 'os-detail-template--mobile' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  contentClass = computed(() => {
    return [
      'os-detail-template__content',
      this.showSidebar() && !this.isMobile() ? 'os-detail-template__content--with-sidebar' : '',
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

  public tabSize = computed(() => {
    const sizeMap = {
      small: 'small' as const,
      medium: 'medium' as const,
      large: 'large' as const,
    };
    return sizeMap[this.size()];
  });

  public actionSize = computed(() => {
    const sizeMap = {
      small: 'small' as const,
      medium: 'medium' as const,
      large: 'large' as const,
    };
    return sizeMap[this.size()];
  });

  public navigationItems = signal<NavigationItem[]>([]);

  public tabsAriaLabel = computed(() => {
    const tabs = this.tabs();
    if (tabs.length === 0) return null;
    return `Navegação por abas: ${tabs.map((t) => t.label).join(', ')}`;
  });

  public mainAriaLabel = computed(() => {
    return `Conteúdo principal de ${this.title()}`;
  });

  public actionsAriaLabel = computed(() => {
    const actions = this.actions();
    if (actions.length === 0) return null;
    return `Ações disponíveis: ${actions.map((a) => a.label).join(', ')}`;
  });

  public navigationVariant = signal('tabs' as const);
  public navigationSize = signal('medium' as const);
  public navigationOrientation = signal('horizontal' as const);
  public navigationActiveItemId = signal<string | null>(null);

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
    return this.localeService.formatNumber(numValue, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  public formatPercentage(value: string | number | Date): string {
    const numValue = typeof value === 'number' ? value : parseFloat(value.toString());
    return this.localeService.formatNumber(numValue, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 2,
    });
  }

  public formatDate(value: string | number | Date): string {
    return this.localeService.formatDateShort(value);
  }

  public toggleSection(section: DetailTemplateSection): void {
    if (section.collapsible) {
      section.expanded = !section.expanded;
      this.sectionToggled.emit({ section, expanded: section.expanded });
    }
  }

  public handleHeaderActionClick(event: PageHeaderAction): void {
    const detailAction: DetailTemplateAction = {
      id: event.label.toLowerCase().replace(/\s+/g, '-'),
      label: event.label,
      variant: event.variant || 'primary',
      icon: event.icon,
      disabled: event.disabled,
    };
    this.headerActionClicked.emit({ action: detailAction, event: new MouseEvent('click') });
  }

  public onTabClick(item: NavigationItem): void {
    const tab = this.tabs().find((t) => t.id === item.id);
    if (tab) {
      this.tabChanged.emit({ tab, event: new MouseEvent('click') });
    }
  }
}
