import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { OsIconComponent } from '../../atoms/os-icon/os-icon.component';

export type OsDropdownSize = 'small' | 'medium' | 'large';
export type OsDropdownVariant = 'default' | 'primary' | 'secondary' | 'accent';
export type OsDropdownAlignment = 'start' | 'center' | 'end';

export interface OsDropdownOption {
  value: any;
  label: string;
  disabled?: boolean;
  icon?: string;
  divider?: boolean;
}

@Component({
  selector: 'os-dropdown',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatMenuModule, MatDividerModule, OsIconComponent],
  template: `
    <div [class]="containerClass()" [attr.data-variant]="variant()" [attr.data-size]="size()">
      <button
        mat-button
        [matMenuTriggerFor]="menu"
        [disabled]="disabled()"
        [class]="triggerClass()"
        [attr.aria-label]="ariaLabel()"
        [attr.aria-expanded]="isOpen()"
        [attr.aria-haspopup]="'menu'"
        (click)="handleTriggerClick($event)"
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
        />
        }
      </button>

      <mat-menu
        #menu="matMenu"
        [class]="menuClass()"
        [xPosition]="xPosition()"
        [yPosition]="yPosition()"
      >
        @if (placeholder()) {
        <button mat-menu-item [disabled]="true" [class]="placeholderClass()">
          {{ placeholder() }}
        </button>
        @if (options().length > 0) {
        <mat-divider></mat-divider>
        } } @for (option of options(); track option.value) { @if (option.divider) {
        <mat-divider></mat-divider>
        } @else {
        <button
          mat-menu-item
          [disabled]="option.disabled"
          [class]="optionClass(option)"
          [attr.aria-label]="option.label"
          (click)="handleOptionClick(option, $event)"
        >
          @if (option.icon) {
          <os-icon [name]="option.icon" [size]="getIconSize()" [variant]="getIconVariant()" />
          }
          <span [class]="optionTextClass()">{{ option.label }}</span>
        </button>
        } }
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
  options = input<OsDropdownOption[]>([]);
  placeholder = input<string>('');
  selectedValue = input<any>(null);
  variant = input<OsDropdownVariant>('default');
  size = input<OsDropdownSize>('medium');
  disabled = input(false);
  icon = input<string>('');
  showChevron = input(true);
  alignment = input<OsDropdownAlignment>('start');
  ariaLabel = input<string>('');

  valueChange = output<any>();
  optionSelect = output<OsDropdownOption>();
  menuOpen = output<void>();
  menuClose = output<void>();

  @ViewChild('menu') menu!: any;

  private _isOpen = signal(false);

  isOpen = computed(() => this._isOpen());

  selectedLabel = computed(() => {
    const selected = this.options().find((option) => option.value === this.selectedValue());
    return selected ? selected.label : this.placeholder();
  });

  // Mapeamento interno para Atoms
  protected getIconSize = () => {
    const sizeMap: Record<OsDropdownSize, 'sm' | 'md' | 'lg'> = {
      small: 'sm',
      medium: 'md',
      large: 'lg',
    };
    return sizeMap[this.size()];
  };

  protected getIconVariant = () => {
    const variantMap: Record<OsDropdownVariant, 'default' | 'primary' | 'secondary' | 'info'> = {
      default: 'default',
      primary: 'primary',
      secondary: 'secondary',
      accent: 'info',
    };
    return variantMap[this.variant()];
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

    return classes.join(' ');
  });

  placeholderClass = computed(() => {
    const classes = ['os-dropdown__placeholder'];

    if (this.size() !== 'medium') {
      classes.push(`os-dropdown__placeholder--${this.size()}`);
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

  handleTriggerClick(event: MouseEvent): void {
    if (!this.disabled()) {
      this._isOpen.set(true);
      this.menuOpen.emit();
    }
  }

  handleOptionClick(option: OsDropdownOption, event: MouseEvent): void {
    if (!option.disabled) {
      this.valueChange.emit(option.value);
      this.optionSelect.emit(option);
      this._isOpen.set(false);
      this.menuClose.emit();
    }
  }
}
