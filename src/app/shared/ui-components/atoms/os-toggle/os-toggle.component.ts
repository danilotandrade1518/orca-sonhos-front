import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'os-toggle',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="os-toggle" [class]="toggleClasses()">
      <input
        type="checkbox"
        [id]="id()"
        [name]="name()"
        [disabled]="disabled()"
        [checked]="checked()"
        (change)="onToggle($event)"
        class="os-toggle__input"
      />
      <label [for]="id()" class="os-toggle__label">
        <span class="os-toggle__slider"></span>
        @if (label()) {
        <span class="os-toggle__text">{{ label() }}</span>
        }
      </label>
    </div>
  `,
  styleUrls: ['./os-toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OsToggleComponent {
  readonly id = input<string>(`toggle-${Math.random().toString(36).substr(2, 9)}`);
  readonly name = input<string>('');
  readonly label = input<string | null>(null);
  readonly checked = input(false);
  readonly disabled = input(false);
  readonly size = input<'small' | 'medium' | 'large'>('medium');
  readonly variant = input<'primary' | 'secondary' | 'success' | 'warning' | 'danger'>('primary');

  readonly toggled = output<boolean>();

  readonly toggleClasses = computed(() => {
    const classes = ['os-toggle'];
    classes.push(`os-toggle--${this.size()}`);
    classes.push(`os-toggle--${this.variant()}`);

    if (this.disabled()) {
      classes.push('os-toggle--disabled');
    }

    if (this.checked()) {
      classes.push('os-toggle--checked');
    }

    return classes.join(' ');
  });

  onToggle(event: Event): void {
    if (!this.disabled()) {
      const target = event.target as HTMLInputElement;
      this.toggled.emit(target.checked);
    }
  }
}
