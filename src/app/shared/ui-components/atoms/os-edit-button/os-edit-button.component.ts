import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OsButtonComponent } from '../os-button/os-button.component';

@Component({
  selector: 'os-edit-button',
  standalone: true,
  imports: [CommonModule, OsButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./os-edit-button.component.scss'],
  template: `
    <os-button
      variant="secondary"
      size="small"
      icon="edit"
      [disabled]="disabled()"
      [loading]="loading()"
      [ariaLabel]="ariaLabel()"
      (buttonClick)="onClick($event)"
    />
  `,
})
export class OsEditButtonComponent {
  readonly ariaLabel = input.required<string>();
  readonly disabled = input<boolean>(false);
  readonly loading = input<boolean>(false);

  readonly editClick = output<MouseEvent>();

  onClick(event: MouseEvent): void {
    if (!this.disabled() && !this.loading()) {
      this.editClick.emit(event);
    }
  }
}
