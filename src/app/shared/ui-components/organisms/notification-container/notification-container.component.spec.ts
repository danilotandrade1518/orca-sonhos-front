import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal, provideZonelessChangeDetection, Signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NotificationContainerComponent } from './notification-container.component';
import {
  NotificationService,
  Notification,
} from '../../../../core/services/notification/notification.service';
import { OsAlertType } from '../../molecules/os-alert/os-alert.component';

interface MockNotificationService {
  notifications: Signal<Notification[]>;
  isLoading: Signal<boolean>;
  dismissNotification: ReturnType<typeof vi.fn>;
  setNotifications: (notifications: Notification[]) => void;
  setLoading: (loading: boolean) => void;
}

describe('NotificationContainerComponent', () => {
  let component: NotificationContainerComponent;
  let fixture: ComponentFixture<NotificationContainerComponent>;
  let mockNotificationService: MockNotificationService;

  beforeEach(async () => {
    
    const notificationsSignal = signal<Notification[]>([]);
    const isLoadingSignal = signal<boolean>(false);

    const notificationServiceSpy: MockNotificationService = {
      dismissNotification: vi.fn(),
      notifications: notificationsSignal,
      isLoading: isLoadingSignal,
      setNotifications: (notifications: Notification[]) => {
        notificationsSignal.set(notifications);
      },
      setLoading: (loading: boolean) => {
        isLoadingSignal.set(loading);
      },
    };

    await TestBed.configureTestingModule({
      imports: [NotificationContainerComponent],
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: NotificationService,
          useValue: notificationServiceSpy as unknown as NotificationService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationContainerComponent);
    component = fixture.componentInstance;
    mockNotificationService = TestBed.inject(
      NotificationService
    ) as unknown as MockNotificationService;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('loading spinner', () => {
    it('should show loading spinner when isLoading is true', () => {
      mockNotificationService.setLoading(true);
      fixture.detectChanges();

      const loadingElement = fixture.nativeElement.querySelector(
        '.os-notification-container__loading'
      );
      expect(loadingElement).toBeTruthy();
    });

    it('should not show loading spinner when isLoading is false', () => {
      mockNotificationService.setLoading(false);
      fixture.detectChanges();

      const loadingElement = fixture.nativeElement.querySelector(
        '.os-notification-container__loading'
      );
      expect(loadingElement).toBeFalsy();
    });

    it('should have correct spinner attributes', () => {
      mockNotificationService.setLoading(true);
      fixture.detectChanges();

      const spinnerElement = fixture.nativeElement.querySelector('os-spinner');
      expect(spinnerElement).toBeTruthy();
      expect(spinnerElement.getAttribute('size')).toBe('md');
      expect(spinnerElement.getAttribute('variant')).toBe('primary');
      expect(spinnerElement.getAttribute('ariaLabel')).toBe('Carregando...');
    });
  });

  describe('notifications display', () => {
    it('should not show notifications when array is empty', () => {
      mockNotificationService.setNotifications([]);
      fixture.detectChanges();

      const notificationsContainer = fixture.nativeElement.querySelector(
        '.os-notification-container__notifications'
      );
      const alertElements = fixture.nativeElement.querySelectorAll('os-alert');

      expect(notificationsContainer).toBeTruthy();
      expect(alertElements.length).toBe(0);
    });

    it('should display single notification', () => {
      const mockNotification: Notification = {
        id: 'test-1',
        type: 'success',
        message: 'Test message',
        title: 'Test title',
        dismissible: true,
        duration: 5000,
      };

      mockNotificationService.setNotifications([mockNotification]);
      fixture.detectChanges();

      const alertElements = fixture.nativeElement.querySelectorAll('os-alert');
      expect(alertElements.length).toBe(1);

      const alertElement = alertElements[0];
      expect(alertElement.textContent).toContain('Test message');
    });

    it('should display multiple notifications', () => {
      const mockNotifications: Notification[] = [
        {
          id: 'test-1',
          type: 'success',
          message: 'Success message',
          title: 'Success',
          dismissible: true,
          duration: 5000,
        },
        {
          id: 'test-2',
          type: 'error',
          message: 'Error message',
          title: 'Error',
          dismissible: true,
          duration: 8000,
        },
        {
          id: 'test-3',
          type: 'warning',
          message: 'Warning message',
          title: 'Warning',
          dismissible: true,
          duration: 6000,
        },
      ];

      mockNotificationService.setNotifications(mockNotifications);
      fixture.detectChanges();

      const alertElements = fixture.nativeElement.querySelectorAll('os-alert');
      expect(alertElements.length).toBe(3);
    });

    it('should handle notification without title', () => {
      const mockNotification: Notification = {
        id: 'test-1',
        type: 'info',
        message: 'Info message',
        dismissible: true,
        duration: 4000,
      };

      mockNotificationService.setNotifications([mockNotification]);
      fixture.detectChanges();

      const alertElement = fixture.nativeElement.querySelector('os-alert');
      expect(alertElement).toBeTruthy();
    });

    it('should handle notification with undefined dismissible', () => {
      const mockNotification: Notification = {
        id: 'test-1',
        type: 'success',
        message: 'Test message',
        dismissible: undefined,
        duration: 5000,
      };

      mockNotificationService.setNotifications([mockNotification]);
      fixture.detectChanges();

      const alertElement = fixture.nativeElement.querySelector('os-alert');
      expect(alertElement).toBeTruthy();
    });

    it('should handle notification with false dismissible', () => {
      const mockNotification: Notification = {
        id: 'test-1',
        type: 'success',
        message: 'Test message',
        dismissible: false,
        duration: 5000,
      };

      mockNotificationService.setNotifications([mockNotification]);
      fixture.detectChanges();

      const alertElement = fixture.nativeElement.querySelector('os-alert');
      expect(alertElement).toBeTruthy();
    });
  });

  describe('notification types', () => {
    const notificationTypes: OsAlertType[] = ['success', 'error', 'warning', 'info'];

    notificationTypes.forEach((type) => {
      it(`should display ${type} notification correctly`, () => {
        const mockNotification: Notification = {
          id: `test-${type}`,
          type,
          message: `${type} message`,
          title: type.charAt(0).toUpperCase() + type.slice(1),
          dismissible: true,
          duration: 5000,
        };

        mockNotificationService.setNotifications([mockNotification]);
        fixture.detectChanges();

        const alertElement = fixture.nativeElement.querySelector('os-alert');
        expect(alertElement).toBeTruthy();
      });
    });
  });

  describe('dismiss functionality', () => {
    it('should call dismissNotification when dismiss event is emitted', () => {
      const mockNotification: Notification = {
        id: 'test-1',
        type: 'success',
        message: 'Test message',
        dismissible: true,
        duration: 5000,
      };

      mockNotificationService.setNotifications([mockNotification]);
      fixture.detectChanges();

      const alertElement = fixture.nativeElement.querySelector('os-alert');
      alertElement.dispatchEvent(new CustomEvent('dismiss'));

      expect(mockNotificationService.dismissNotification).toHaveBeenCalledWith('test-1');
    });

    it('should call dismissNotification with correct id for multiple notifications', () => {
      const mockNotifications: Notification[] = [
        {
          id: 'test-1',
          type: 'success',
          message: 'First message',
          dismissible: true,
          duration: 5000,
        },
        {
          id: 'test-2',
          type: 'error',
          message: 'Second message',
          dismissible: true,
          duration: 8000,
        },
      ];

      mockNotificationService.setNotifications(mockNotifications);
      fixture.detectChanges();

      const alertElements = fixture.nativeElement.querySelectorAll('os-alert');
      
      alertElements[0].dispatchEvent(new CustomEvent('dismiss'));
      expect(mockNotificationService.dismissNotification).toHaveBeenCalledWith('test-1');
      
      alertElements[1].dispatchEvent(new CustomEvent('dismiss'));
      expect(mockNotificationService.dismissNotification).toHaveBeenCalledWith('test-2');
    });
  });

  describe('CSS classes', () => {
    it('should have correct CSS classes on loading container', () => {
      mockNotificationService.setLoading(true);
      fixture.detectChanges();

      const loadingElement = fixture.nativeElement.querySelector(
        '.os-notification-container__loading'
      );
      expect(loadingElement).toBeTruthy();
    });

    it('should have correct CSS classes on notifications container', () => {
      mockNotificationService.setNotifications([]);
      fixture.detectChanges();

      const notificationsContainer = fixture.nativeElement.querySelector(
        '.os-notification-container__notifications'
      );
      expect(notificationsContainer).toBeTruthy();
    });

    it('should have correct CSS classes on alert elements', () => {
      const mockNotification: Notification = {
        id: 'test-1',
        type: 'success',
        message: 'Test message',
        dismissible: true,
        duration: 5000,
      };

      mockNotificationService.setNotifications([mockNotification]);
      fixture.detectChanges();

      const alertElement = fixture.nativeElement.querySelector('os-alert');
      expect(alertElement.classList.contains('os-notification-container__alert')).toBe(true);
    });
  });

  describe('change detection', () => {
    it('should update when notifications signal changes', () => {
      mockNotificationService.setNotifications([]);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelectorAll('os-alert').length).toBe(0);
      
      mockNotificationService.setNotifications([
        {
          id: 'test-1',
          type: 'success',
          message: 'Test message',
          dismissible: true,
          duration: 5000,
        },
      ]);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelectorAll('os-alert').length).toBe(1);
    });

    it('should update when loading signal changes', () => {
      mockNotificationService.setLoading(false);
      fixture.detectChanges();

      expect(
        fixture.nativeElement.querySelector('.os-notification-container__loading')
      ).toBeFalsy();
      
      mockNotificationService.setLoading(true);
      fixture.detectChanges();

      expect(
        fixture.nativeElement.querySelector('.os-notification-container__loading')
      ).toBeTruthy();
    });
  });

  describe('edge cases', () => {
    it('should handle null notification properties gracefully', () => {
      const mockNotification: Notification = {
        id: 'test-1',
        type: 'success',
        message: '',
        title: undefined,
        dismissible: undefined,
        duration: undefined,
      };

      mockNotificationService.setNotifications([mockNotification]);
      fixture.detectChanges();

      const alertElement = fixture.nativeElement.querySelector('os-alert');
      expect(alertElement).toBeTruthy();
    });

    it('should handle very long notification messages', () => {
      const longMessage = 'A'.repeat(1000);
      const mockNotification: Notification = {
        id: 'test-1',
        type: 'info',
        message: longMessage,
        dismissible: true,
        duration: 5000,
      };

      mockNotificationService.setNotifications([mockNotification]);
      fixture.detectChanges();

      const alertElement = fixture.nativeElement.querySelector('os-alert');
      expect(alertElement).toBeTruthy();
      expect(alertElement.textContent).toContain(longMessage.substring(0, 50));
    });
  });
});
