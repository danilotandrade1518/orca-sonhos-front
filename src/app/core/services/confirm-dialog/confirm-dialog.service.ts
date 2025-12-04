import { Injectable, inject } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { OsConfirmDialogComponent, ConfirmDialogData, ConfirmDialogVariant } from '@shared/ui-components/organisms/os-confirm-dialog/os-confirm-dialog.component';

export interface ConfirmDialogConfig {
  title: string;
  message: string;
  variant?: ConfirmDialogVariant;
  confirmText?: string;
  cancelText?: string;
  width?: string;
  disableClose?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ConfirmDialogService {
  private readonly dialog = inject(MatDialog);

  async open(config: ConfirmDialogConfig): Promise<boolean> {
    const dialogConfig: MatDialogConfig<ConfirmDialogData> = {
      width: config.width || '400px',
      maxWidth: '90vw',
      disableClose: config.disableClose ?? false,
      data: {
        title: config.title,
        message: config.message,
        variant: config.variant || 'info',
        confirmText: config.confirmText,
        cancelText: config.cancelText,
      } as ConfirmDialogData,
    };

    const dialogRef = this.dialog.open<OsConfirmDialogComponent, ConfirmDialogData, boolean>(
      OsConfirmDialogComponent,
      dialogConfig
    );

    return dialogRef.afterClosed().toPromise().then((result) => result === true);
  }
}

