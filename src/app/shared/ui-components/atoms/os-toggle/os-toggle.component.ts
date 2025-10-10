import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'os-toggle',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSlideToggleModule],
  template: `
    <mat-slide-toggle
      [id]="id()"
      [name]="name()"
      [disabled]="disabled()"
      [checked]="checked()"
      [color]="matColor()"
      [class]="toggleClasses()"
      (change)="onToggle($event)"
    >
      @if (label()) {
      {{ label() }}
      }
    </mat-slide-toggle>
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
      default:
        return undefined;
    }
  });

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

  onToggle(event: { checked: boolean }): void {
    if (!this.disabled()) {
      this.toggled.emit(event.checked);
    }
  }
}
