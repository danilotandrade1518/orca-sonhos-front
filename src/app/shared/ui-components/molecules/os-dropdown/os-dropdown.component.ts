import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { OsIconComponent } from '../../atoms/os-icon/os-icon.component';
import { OsInputComponent } from '../../atoms/os-input/os-input.component';

export type OsDropdownSize = 'small' | 'medium' | 'large';
export type OsDropdownVariant = 'default' | 'primary' | 'secondary' | 'accent';
export type OsDropdownAlignment = 'start' | 'center' | 'end';

export interface OsDropdownOption {
  value: string | number | boolean;
  label: string;
  disabled?: boolean;
  icon?: string;
  divider?: boolean;
  group?: string;
}

export interface OsDropdownGroup {
  name: string;
  options: OsDropdownOption[];
}

@Component({
  selector: 'os-dropdown',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
    ScrollingModule,
    OsIconComponent,
    OsInputComponent,
  ],
  template: `
    <div
      [class]="containerClass()"
      [attr.data-variant]="variant()"
      [attr.data-size]="size()"
      role="combobox"
      [attr.aria-expanded]="isOpen()"
      [attr.aria-haspopup]="'listbox'"
      [attr.aria-controls]="menuId()"
      [attr.aria-label]="ariaLabel() || 'Dropdown menu'"
    >
      <button
        mat-button
        #trigger
        [matMenuTriggerFor]="menu"
        [disabled]="disabled()"
        [class]="triggerClass()"
        [attr.aria-label]="ariaLabel() || selectedLabel()"
        [attr.aria-expanded]="isOpen()"
        [attr.aria-haspopup]="'listbox'"
        [attr.aria-controls]="menuId()"
        (menuOpened)="handleMenuOpened()"
        (menuClosed)="handleMenuClosed()"
        (click)="handleTriggerClick()"
        (keydown)="handleTriggerKeydown($event)"
      >
        @if (icon()) {
        <os-icon [name]="icon()" [size]="getIconSize()" [variant]="getIconVariant()" />
        }
        <span [class]="textClass()">
          {{ selectedLabel() }}
        </span>
        @if (showChevron()) {
        <os-icon
          [name]="isOpen() ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
          [size]="getIconSize()"
          [variant]="getIconVariant()"
          aria-hidden="true"
        />
        }
      </button>

      <mat-menu
        #menu="matMenu"
        [class]="menuClass()"
        [xPosition]="xPosition()"
        [yPosition]="yPosition()"
        [attr.id]="menuId()"
        role="listbox"
        [attr.aria-label]="ariaLabel() || 'Options'"
      >
        @if (searchable() && filteredOptions().length > searchThreshold()) {
        <div
          class="os-dropdown__search"
          (click)="$event.stopPropagation()"
          (keydown)="handleSearchKeydown($event)"
          tabindex="0"
        >
          <os-input
            #searchInput
            [value]="searchQuery()"
            [placeholder]="searchPlaceholder()"
            [prefixIcon]="'search'"
            [size]="size()"
            [ariaLabel]="'Search options'"
            (valueChange)="handleSearchChange($event)"
            (keydown)="handleSearchKeydown($event)"
          />
        </div>
        <mat-divider></mat-divider>
        } @if (placeholder() && !searchQuery()) {
        <button
          mat-menu-item
          [disabled]="true"
          [class]="placeholderClass()"
          role="menuitem"
          [attr.aria-selected]="false"
        >
          {{ placeholder() }}
        </button>
        @if (filteredOptions().length > 0) {
        <mat-divider></mat-divider>
        } } @if (useVirtualScroll() && filteredOptions().length > virtualScrollThreshold()) {
        <cdk-virtual-scroll-viewport
          [itemSize]="getItemHeight()"
          [class]="virtualScrollClass()"
          [attr.aria-label]="'Options list'"
        >
          @for (item of virtualScrollItems(); track item.value; let idx = $index) { @if
          (item.divider) {
          <mat-divider></mat-divider>
          } @else if (item.isGroupHeader) {
          <div [class]="groupHeaderClass()" role="group" [attr.aria-label]="item.label">
            {{ item.label }}
          </div>
          } @else {
          <button
            mat-menu-item
            [disabled]="item.disabled"
            [class]="optionClass(item)"
            [attr.aria-label]="item.label"
            [attr.aria-selected]="item.value === selectedValue()"
            [attr.data-index]="idx"
            role="menuitem"
            (click)="handleOptionClick(item)"
            (keydown)="handleOptionKeydown($event, item)"
          >
            @if (item.icon) {
            <os-icon
              [name]="item.icon"
              [size]="getIconSize()"
              [variant]="getIconVariant()"
              aria-hidden="true"
            />
            }
            <span [class]="optionTextClass()">{{ item.label }}</span>
            @if (item.value === selectedValue()) {
            <os-icon name="check" [size]="getIconSize()" [variant]="'primary'" aria-hidden="true" />
            }
          </button>
          } }
        </cdk-virtual-scroll-viewport>
        } @else { @for (item of flattenedOptions(); track item.value; let idx = $index) { @if
        (item.divider) {
        <mat-divider></mat-divider>
        } @else if (item.isGroupHeader) {
        <div [class]="groupHeaderClass()" role="group" [attr.aria-label]="item.label">
          {{ item.label }}
        </div>
        } @else {
        <button
          mat-menu-item
          [disabled]="item.disabled"
          [class]="optionClass(item)"
          [attr.aria-label]="item.label"
          [attr.aria-selected]="item.value === selectedValue()"
          [attr.data-index]="idx"
          role="menuitem"
          (click)="handleOptionClick(item)"
          (keydown)="handleOptionKeydown($event, item)"
        >
          @if (item.icon) {
          <os-icon
            [name]="item.icon"
            [size]="getIconSize()"
            [variant]="getIconVariant()"
            aria-hidden="true"
          />
          }
          <span [class]="optionTextClass()">{{ item.label }}</span>
          @if (item.value === selectedValue()) {
          <os-icon name="check" [size]="getIconSize()" [variant]="'primary'" aria-hidden="true" />
          }
        </button>
        } } } @if (filteredOptions().length === 0 && searchQuery()) {
        <div [class]="emptyStateClass()" role="status" aria-live="polite">
          {{ noResultsText() }}
        </div>
        }
      </mat-menu>
    </div>
  `,
  styleUrl: './os-dropdown.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'os-dropdown-host',
  },
})
export class OsDropdownComponent {
  private breakpointObserver = inject(BreakpointObserver);

  options = input<OsDropdownOption[]>([]);
  groups = input<OsDropdownGroup[]>([]);
  placeholder = input<string>('');
  selectedValue = input<string | number | boolean | null>(null);
  variant = input<OsDropdownVariant>('default');
  size = input<OsDropdownSize>('medium');
  disabled = input(false);
  icon = input<string>('');
  showChevron = input(true);
  alignment = input<OsDropdownAlignment>('start');
  ariaLabel = input<string>('');
  searchable = input(false);
  searchPlaceholder = input('Search...');
  searchThreshold = input(5);
  useVirtualScroll = input(false);
  virtualScrollThreshold = input(20);
  noResultsText = input('No results found');

  valueChange = output<string | number | boolean>();
  optionSelect = output<OsDropdownOption>();
  menuOpen = output<void>();
  menuClose = output<void>();
  searchChange = output<string>();

  @ViewChild('menu') menu!: MatMenu;
  @ViewChild('trigger', { read: ElementRef }) triggerElement!: ElementRef;
  @ViewChild('searchInput', { read: ElementRef }) searchInputElement!: ElementRef;

  private _isOpen = signal(false);
  private _searchQuery = signal('');
  private _focusedOptionIndex = signal(-1);
  private _isMobile = signal(false);

  menuId = computed(() => `os-dropdown-menu-${Math.random().toString(36).substr(2, 9)}`);
  isOpen = computed(() => this._isOpen());
  searchQuery = computed(() => this._searchQuery());
  focusedOptionIndex = computed(() => this._focusedOptionIndex());
  isMobile = computed(() => this._isMobile());

  constructor() {
    this.breakpointObserver.observe([Breakpoints.HandsetPortrait]).subscribe((result) => {
      this._isMobile.set(result.matches);
    });
  }

  selectedLabel = computed(() => {
    const allOptions = this.getAllOptions();
    const selected = allOptions.find((option) => option.value === this.selectedValue());
    return selected ? selected.label : this.placeholder();
  });

  flattenedOptions = computed(() => {
    const result: (OsDropdownOption & { isGroupHeader?: boolean })[] = [];
    const groupsList = this.groups();
    const optionsList = this.options();

    if (groupsList.length > 0) {
      groupsList.forEach((group) => {
        if (group.options.length > 0) {
          result.push({ value: '', label: group.name, isGroupHeader: true, disabled: true });
          result.push(...group.options);
        }
      });
    } else {
      result.push(...optionsList);
    }

    return result;
  });

  filteredOptions = computed(() => {
    const query = this._searchQuery().toLowerCase().trim();
    if (!query) {
      return this.flattenedOptions();
    }

    return this.flattenedOptions().filter((option) => {
      if (option.isGroupHeader || option.divider) {
        return false;
      }
      return option.label.toLowerCase().includes(query);
    });
  });

  virtualScrollItems = computed(() => {
    return this.filteredOptions();
  });

  getIconSize = () => {
    const sizeMap: Record<OsDropdownSize, 'sm' | 'md' | 'lg'> = {
      small: 'sm',
      medium: 'md',
      large: 'lg',
    };
    return sizeMap[this.size()];
  };

  getIconVariant = () => {
    const variantMap: Record<OsDropdownVariant, 'default' | 'primary' | 'secondary' | 'info'> = {
      default: 'default',
      primary: 'primary',
      secondary: 'secondary',
      accent: 'info',
    };
    return variantMap[this.variant()];
  };

  getItemHeight = () => {
    const heightMap: Record<OsDropdownSize, number> = {
      small: 32,
      medium: 40,
      large: 48,
    };
    return heightMap[this.size()];
  };

  containerClass = computed(() => {
    const classes = ['os-dropdown'];

    if (this.variant() !== 'default') {
      classes.push(`os-dropdown--${this.variant()}`);
    }

    if (this.size() !== 'medium') {
      classes.push(`os-dropdown--${this.size()}`);
    }

    if (this.disabled()) {
      classes.push('os-dropdown--disabled');
    }

    if (this.isMobile()) {
      classes.push('os-dropdown--mobile');
    }

    return classes.join(' ');
  });

  triggerClass = computed(() => {
    const classes = ['os-dropdown__trigger'];

    if (this.variant() !== 'default') {
      classes.push(`os-dropdown__trigger--${this.variant()}`);
    }

    if (this.size() !== 'medium') {
      classes.push(`os-dropdown__trigger--${this.size()}`);
    }

    if (this.isOpen()) {
      classes.push('os-dropdown__trigger--open');
    }

    return classes.join(' ');
  });

  textClass = computed(() => {
    const classes = ['os-dropdown__text'];

    if (this.size() !== 'medium') {
      classes.push(`os-dropdown__text--${this.size()}`);
    }

    return classes.join(' ');
  });

  menuClass = computed(() => {
    const classes = ['os-dropdown__menu'];

    if (this.size() !== 'medium') {
      classes.push(`os-dropdown__menu--${this.size()}`);
    }

    if (this.isMobile()) {
      classes.push('os-dropdown__menu--mobile');
    }

    return classes.join(' ');
  });

  placeholderClass = computed(() => {
    const classes = ['os-dropdown__placeholder'];

    if (this.size() !== 'medium') {
      classes.push(`os-dropdown__placeholder--${this.size()}`);
    }

    return classes.join(' ');
  });

  virtualScrollClass = computed(() => {
    const classes = ['os-dropdown__virtual-scroll'];

    if (this.size() !== 'medium') {
      classes.push(`os-dropdown__virtual-scroll--${this.size()}`);
    }

    return classes.join(' ');
  });

  groupHeaderClass = computed(() => {
    const classes = ['os-dropdown__group-header'];

    if (this.size() !== 'medium') {
      classes.push(`os-dropdown__group-header--${this.size()}`);
    }

    return classes.join(' ');
  });

  emptyStateClass = computed(() => {
    const classes = ['os-dropdown__empty-state'];

    if (this.size() !== 'medium') {
      classes.push(`os-dropdown__empty-state--${this.size()}`);
    }

    return classes.join(' ');
  });

  optionClass = (option: OsDropdownOption) => {
    const classes = ['os-dropdown__option'];

    if (this.size() !== 'medium') {
      classes.push(`os-dropdown__option--${this.size()}`);
    }

    if (option.disabled) {
      classes.push('os-dropdown__option--disabled');
    }

    if (option.value === this.selectedValue()) {
      classes.push('os-dropdown__option--selected');
    }

    return classes.join(' ');
  };

  optionTextClass = computed(() => {
    const classes = ['os-dropdown__option-text'];

    if (this.size() !== 'medium') {
      classes.push(`os-dropdown__option-text--${this.size()}`);
    }

    return classes.join(' ');
  });

  xPosition = computed(() => {
    switch (this.alignment()) {
      case 'start':
        return 'before';
      case 'end':
        return 'after';
      case 'center':
      default:
        return 'after';
    }
  });

  yPosition = computed(() => 'below' as const);

  handleTriggerClick(): void {
    if (!this.disabled()) {
      this._isOpen.set(true);
    }
  }

  handleMenuOpened(): void {
    this._isOpen.set(true);
    this._searchQuery.set('');
    this._focusedOptionIndex.set(-1);
    this.menuOpen.emit();

    if (this.searchable() && this.filteredOptions().length > this.searchThreshold()) {
      setTimeout(() => {
        this.searchInputElement?.nativeElement?.querySelector('input')?.focus();
      }, 100);
    }
  }

  handleMenuClosed(): void {
    this._isOpen.set(false);
    this._searchQuery.set('');
    this._focusedOptionIndex.set(-1);
    this.menuClose.emit();
  }

  handleOptionClick(option: OsDropdownOption): void {
    if (!option.disabled) {
      this.valueChange.emit(option.value);
      this.optionSelect.emit(option);
      this._isOpen.set(false);
    }
  }

  handleSearchChange(value: string): void {
    this._searchQuery.set(value);
    this.searchChange.emit(value);
  }

  handleTriggerKeydown(event: KeyboardEvent): void {
    if (this.disabled()) {
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp':
        event.preventDefault();
        if (!this.isOpen()) {
          this._isOpen.set(true);
        }
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        this._isOpen.set(!this.isOpen());
        break;
      case 'Escape':
        event.preventDefault();
        this._isOpen.set(false);
        break;
    }
  }

  handleOptionKeydown(event: KeyboardEvent, option: OsDropdownOption): void {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.handleOptionClick(option);
        break;
      case 'Escape':
        event.preventDefault();
        this._isOpen.set(false);
        this.triggerElement?.nativeElement?.focus();
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.focusNextOption();
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.focusPreviousOption();
        break;
    }
  }

  handleSearchKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        this._searchQuery.set('');
        this._isOpen.set(false);
        this.triggerElement?.nativeElement?.focus();
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.focusNextOption();
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.focusPreviousOption();
        break;
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleDocumentKeydown(event: KeyboardEvent): void {
    if (!this.isOpen()) {
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      this._isOpen.set(false);
      this.triggerElement?.nativeElement?.focus();
    }
  }

  private focusNextOption(): void {
    const options = this.filteredOptions().filter((opt) => !opt.disabled && !opt.isGroupHeader);
    if (options.length === 0) {
      return;
    }

    const currentIndex = this._focusedOptionIndex();
    const nextIndex = (currentIndex + 1) % options.length;
    this._focusedOptionIndex.set(nextIndex);
  }

  private focusPreviousOption(): void {
    const options = this.filteredOptions().filter((opt) => !opt.disabled && !opt.isGroupHeader);
    if (options.length === 0) {
      return;
    }

    const currentIndex = this._focusedOptionIndex();
    const previousIndex = currentIndex <= 0 ? options.length - 1 : currentIndex - 1;
    this._focusedOptionIndex.set(previousIndex);
  }

  private getAllOptions(): OsDropdownOption[] {
    const groupsList = this.groups();
    const optionsList = this.options();

    if (groupsList.length > 0) {
      return groupsList.flatMap((group) => group.options);
    }

    return optionsList;
  }
}
