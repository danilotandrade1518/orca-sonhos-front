import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ConfirmDialogService, ConfirmDialogConfig } from './confirm-dialog.service';
import {
  OsConfirmDialogComponent,
  ConfirmDialogData,
} from '@shared/ui-components/organisms/os-confirm-dialog/os-confirm-dialog.component';

describe('ConfirmDialogService', () => {
  let service: ConfirmDialogService;
  let dialog: MatDialog;

  const createMockConfig = (overrides: Partial<ConfirmDialogConfig> = {}): ConfirmDialogConfig => ({
    title: 'Test Title',
    message: 'Test Message',
    variant: 'info',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    ...overrides,
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [ConfirmDialogService, provideZonelessChangeDetection()],
    }).compileComponents();

    service = TestBed.inject(ConfirmDialogService);
    dialog = TestBed.inject(MatDialog);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('open', () => {
    it('should open dialog with default configuration', async () => {
      const config = createMockConfig();

      const openSpy = vi.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: () => of(true),
        close: vi.fn(),
      } as unknown as MatDialogRef<OsConfirmDialogComponent, boolean>);

      const resultPromise = service.open(config);

      expect(openSpy).toHaveBeenCalledTimes(1);
      expect(openSpy).toHaveBeenCalledWith(
        OsConfirmDialogComponent,
        expect.objectContaining({
          width: '400px',
          maxWidth: '90vw',
          disableClose: false,
          data: expect.objectContaining({
            title: 'Test Title',
            message: 'Test Message',
            variant: 'info',
            confirmText: 'Confirmar',
            cancelText: 'Cancelar',
          }),
        } as MatDialogConfig<ConfirmDialogData>)
      );

      const result = await resultPromise;
      expect(result).toBe(true);
    });

    it('should open dialog with custom width', async () => {
      const config = createMockConfig({ width: '600px' });

      const openSpy = vi.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: () => of(false),
        close: vi.fn(),
      } as unknown as MatDialogRef<OsConfirmDialogComponent, boolean>);

      await service.open(config);

      expect(openSpy).toHaveBeenCalledWith(
        OsConfirmDialogComponent,
        expect.objectContaining({
          width: '600px',
        } as MatDialogConfig<ConfirmDialogData>)
      );
    });

    it('should open dialog with disableClose option', async () => {
      const config = createMockConfig({ disableClose: true });

      const openSpy = vi.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: () => of(false),
        close: vi.fn(),
      } as unknown as MatDialogRef<OsConfirmDialogComponent, boolean>);

      await service.open(config);

      expect(openSpy).toHaveBeenCalledWith(
        OsConfirmDialogComponent,
        expect.objectContaining({
          disableClose: true,
        } as MatDialogConfig<ConfirmDialogData>)
      );
    });

    it('should open dialog with danger variant', async () => {
      const config = createMockConfig({ variant: 'danger' });

      const openSpy = vi.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: () => of(true),
        close: vi.fn(),
      } as unknown as MatDialogRef<OsConfirmDialogComponent, boolean>);

      await service.open(config);

      expect(openSpy).toHaveBeenCalledWith(
        OsConfirmDialogComponent,
        expect.objectContaining({
          data: expect.objectContaining({
            variant: 'danger',
          }),
        } as MatDialogConfig<ConfirmDialogData>)
      );
    });

    it('should open dialog with warning variant', async () => {
      const config = createMockConfig({ variant: 'warning' });

      const openSpy = vi.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: () => of(false),
        close: vi.fn(),
      } as unknown as MatDialogRef<OsConfirmDialogComponent, boolean>);

      await service.open(config);

      expect(openSpy).toHaveBeenCalledWith(
        OsConfirmDialogComponent,
        expect.objectContaining({
          data: expect.objectContaining({
            variant: 'warning',
          }),
        } as MatDialogConfig<ConfirmDialogData>)
      );
    });

    it('should open dialog with custom button texts', async () => {
      const config = createMockConfig({
        confirmText: 'Delete',
        cancelText: 'Keep',
      });

      const openSpy = vi.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: () => of(true),
        close: vi.fn(),
      } as unknown as MatDialogRef<OsConfirmDialogComponent, boolean>);

      await service.open(config);

      expect(openSpy).toHaveBeenCalledWith(
        OsConfirmDialogComponent,
        expect.objectContaining({
          data: expect.objectContaining({
            confirmText: 'Delete',
            cancelText: 'Keep',
          }),
        } as MatDialogConfig<ConfirmDialogData>)
      );
    });

    it('should return true when user confirms', async () => {
      const config = createMockConfig();

      vi.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: () => of(true),
        close: vi.fn(),
      } as unknown as MatDialogRef<OsConfirmDialogComponent, boolean>);

      const result = await service.open(config);

      expect(result).toBe(true);
    });

    it('should return false when user cancels', async () => {
      const config = createMockConfig();

      vi.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: () => of(false),
        close: vi.fn(),
      } as unknown as MatDialogRef<OsConfirmDialogComponent, boolean>);

      const result = await service.open(config);

      expect(result).toBe(false);
    });

    it('should return false when dialog is closed without result', async () => {
      const config = createMockConfig();

      vi.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: () => of(undefined),
        close: vi.fn(),
      } as unknown as MatDialogRef<OsConfirmDialogComponent, boolean>);

      const result = await service.open(config);

      expect(result).toBe(false);
    });

    it('should use default variant when not provided', async () => {
      const config: ConfirmDialogConfig = {
        title: 'Test',
        message: 'Test Message',
      };

      const openSpy = vi.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: () => of(true),
        close: vi.fn(),
      } as unknown as MatDialogRef<OsConfirmDialogComponent, boolean>);

      await service.open(config);

      expect(openSpy).toHaveBeenCalledWith(
        OsConfirmDialogComponent,
        expect.objectContaining({
          data: expect.objectContaining({
            variant: 'info',
          }),
        } as MatDialogConfig<ConfirmDialogData>)
      );
    });

    it('should use default width when not provided', async () => {
      const config: ConfirmDialogConfig = {
        title: 'Test',
        message: 'Test Message',
      };

      const openSpy = vi.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: () => of(true),
        close: vi.fn(),
      } as unknown as MatDialogRef<OsConfirmDialogComponent, boolean>);

      await service.open(config);

      expect(openSpy).toHaveBeenCalledWith(
        OsConfirmDialogComponent,
        expect.objectContaining({
          width: '400px',
        } as MatDialogConfig<ConfirmDialogData>)
      );
    });

    it('should use default disableClose when not provided', async () => {
      const config: ConfirmDialogConfig = {
        title: 'Test',
        message: 'Test Message',
      };

      const openSpy = vi.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: () => of(true),
        close: vi.fn(),
      } as unknown as MatDialogRef<OsConfirmDialogComponent, boolean>);

      await service.open(config);

      expect(openSpy).toHaveBeenCalledWith(
        OsConfirmDialogComponent,
        expect.objectContaining({
          disableClose: false,
        } as MatDialogConfig<ConfirmDialogData>)
      );
    });
  });
});
