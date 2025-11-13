import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OsButtonComponent } from '../os-button/os-button.component';

@Component({
  selector: 'os-delete-button',
  standalone: true,
  imports: [CommonModule, OsButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./os-delete-button.component.scss'],
  template: `
    <os-button
      variant="danger"
      size="small"
      icon="delete"
      [disabled]="disabled()"
      [loading]="loading()"
      [ariaLabel]="ariaLabel()"
      (buttonClick)="onClick($event)"
    />
  `,
})
export class OsDeleteButtonComponent {
  readonly ariaLabel = input.required<string>();
  readonly disabled = input<boolean>(false);
  readonly loading = input<boolean>(false);

  readonly deleteClick = output<MouseEvent>();

  onClick(event: MouseEvent): void {
    if (!this.disabled() && !this.loading()) {
      this.deleteClick.emit(event);
    }
  }
}
