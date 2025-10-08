import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

export type OsButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';
export type OsButtonSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'os-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  template: `
    @if (variant() === 'primary') {
    <button
      mat-raised-button
      [disabled]="disabled() || loading()"
      [type]="type()"
      [class]="buttonClass()"
      (click)="handleClick($event)"
    >
      @if (loading()) {
      <span class="os-button__spinner" aria-hidden="true"></span>
      } @else if (icon() && !loading()) {
      <span class="os-button__icon" [attr.aria-hidden]="true">
        {{ icon() }}
      </span>
      }
      <span class="os-button__content">
        <ng-content />
      </span>
    </button>
    } @else if (variant() === 'secondary') {
    <button
      mat-outlined-button
      [disabled]="disabled() || loading()"
      [type]="type()"
      [class]="buttonClass()"
      (click)="handleClick($event)"
    >
      @if (loading()) {
      <span class="os-button__spinner" aria-hidden="true"></span>
      } @else if (icon() && !loading()) {
      <span class="os-button__icon" [attr.aria-hidden]="true">
        {{ icon() }}
      </span>
      }
      <span class="os-button__content">
        <ng-content />
      </span>
    </button>
    } @else if (variant() === 'tertiary') {
    <button
      mat-button
      [disabled]="disabled() || loading()"
      [type]="type()"
      [class]="buttonClass()"
      (click)="handleClick($event)"
    >
      @if (loading()) {
      <span class="os-button__spinner" aria-hidden="true"></span>
      } @else if (icon() && !loading()) {
      <span class="os-button__icon" [attr.aria-hidden]="true">
        {{ icon() }}
      </span>
      }
      <span class="os-button__content">
        <ng-content />
      </span>
    </button>
    } @else if (variant() === 'danger') {
    <button
      mat-flat-button
      [disabled]="disabled() || loading()"
      [type]="type()"
      [class]="buttonClass()"
      (click)="handleClick($event)"
    >
      @if (loading()) {
      <span class="os-button__spinner" aria-hidden="true"></span>
      } @else if (icon() && !loading()) {
      <span class="os-button__icon" [attr.aria-hidden]="true">
        {{ icon() }}
      </span>
      }
      <span class="os-button__content">
        <ng-content />
      </span>
    </button>
    }
  `,
  styleUrls: ['./os-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OsButtonComponent {
  variant = input<OsButtonVariant>('primary');
  size = input<OsButtonSize>('medium');
  disabled = input(false);
  loading = input(false);
  icon = input<string>('');
  type = input<'button' | 'submit' | 'reset'>('button');

  buttonClick = output<MouseEvent>();

  buttonClass = computed(() => {
    return [
      'os-button',
      `os-button--${this.variant()}`,
      `os-button--${this.size()}`,
      this.disabled() ? 'os-button--disabled' : '',
      this.loading() ? 'os-button--loading' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  handleClick(event: MouseEvent): void {
    if (!this.disabled() && !this.loading()) {
      this.buttonClick.emit(event);
    }
  }

  // Mapeamento interno para Material
  protected matColor = computed(() => {
    switch (this.variant()) {
      case 'primary':
        return 'primary';
      case 'secondary':
        return 'accent';
      case 'tertiary':
        return 'primary';
      case 'danger':
        return 'warn';
      default:
        return undefined;
    }
  });
}
