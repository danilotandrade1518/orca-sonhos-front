import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), NotificationService],
    });
    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initial state', () => {
    it('should initialize with empty notifications array', () => {
      expect(service.notifications()).toEqual([]);
    });

    it('should initialize with loading state as false', () => {
      expect(service.isLoading()).toBe(false);
    });

    it('should initialize with hasNotifications as false', () => {
      expect(service.hasNotifications()).toBe(false);
    });
  });

  describe('showSuccess', () => {
    it('should add success notification with correct properties', () => {
      const message = 'Operation completed successfully';
      const title = 'Success';
      const duration = 3000;

      const notificationId = service.showSuccess(message, title, duration);

      expect(notificationId).toBeTruthy();
      expect(service.notifications().length).toBe(1);

      const notification = service.notifications()[0];
      expect(notification.id).toBe(notificationId);
      expect(notification.type).toBe('success');
      expect(notification.message).toBe(message);
      expect(notification.title).toBe(title);
      expect(notification.dismissible).toBe(true);
      expect(notification.duration).toBe(duration);
    });

    it('should add success notification with default duration when not provided', () => {
      const message = 'Operation completed';

      service.showSuccess(message);

      const notification = service.notifications()[0];
      expect(notification.duration).toBe(5000);
    });

    it('should add success notification without title when not provided', () => {
      const message = 'Operation completed';

      service.showSuccess(message);

      const notification = service.notifications()[0];
      expect(notification.title).toBeUndefined();
    });
  });

  describe('showError', () => {
    it('should add error notification with correct properties', () => {
      const message = 'Operation failed';
      const title = 'Error';
      const duration = 10000;

      const notificationId = service.showError(message, title, duration);

      expect(notificationId).toBeTruthy();
      expect(service.notifications().length).toBe(1);

      const notification = service.notifications()[0];
      expect(notification.id).toBe(notificationId);
      expect(notification.type).toBe('error');
      expect(notification.message).toBe(message);
      expect(notification.title).toBe(title);
      expect(notification.dismissible).toBe(true);
      expect(notification.duration).toBe(duration);
    });

    it('should add error notification with default duration when not provided', () => {
      const message = 'Operation failed';

      service.showError(message);

      const notification = service.notifications()[0];
      expect(notification.duration).toBe(8000);
    });
  });

  describe('showWarning', () => {
    it('should add warning notification with correct properties', () => {
      const message = 'Please be careful';
      const title = 'Warning';
      const duration = 7000;

      const notificationId = service.showWarning(message, title, duration);

      expect(notificationId).toBeTruthy();
      expect(service.notifications().length).toBe(1);

      const notification = service.notifications()[0];
      expect(notification.id).toBe(notificationId);
      expect(notification.type).toBe('warning');
      expect(notification.message).toBe(message);
      expect(notification.title).toBe(title);
      expect(notification.dismissible).toBe(true);
      expect(notification.duration).toBe(duration);
    });

    it('should add warning notification with default duration when not provided', () => {
      const message = 'Please be careful';

      service.showWarning(message);

      const notification = service.notifications()[0];
      expect(notification.duration).toBe(6000);
    });
  });

  describe('showInfo', () => {
    it('should add info notification with correct properties', () => {
      const message = 'Information message';
      const title = 'Info';
      const duration = 3000;

      const notificationId = service.showInfo(message, title, duration);

      expect(notificationId).toBeTruthy();
      expect(service.notifications().length).toBe(1);

      const notification = service.notifications()[0];
      expect(notification.id).toBe(notificationId);
      expect(notification.type).toBe('info');
      expect(notification.message).toBe(message);
      expect(notification.title).toBe(title);
      expect(notification.dismissible).toBe(true);
      expect(notification.duration).toBe(duration);
    });

    it('should add info notification with default duration when not provided', () => {
      const message = 'Information message';

      service.showInfo(message);

      const notification = service.notifications()[0];
      expect(notification.duration).toBe(4000);
    });
  });

  describe('setLoading', () => {
    it('should update loading state to true', () => {
      service.setLoading(true);
      expect(service.isLoading()).toBe(true);
    });

    it('should update loading state to false', () => {
      service.setLoading(false);
      expect(service.isLoading()).toBe(false);
    });
  });

  describe('dismissNotification', () => {
    it('should remove notification by id', () => {
      const id1 = service.showSuccess('Message 1');
      const id2 = service.showError('Message 2');

      expect(service.notifications().length).toBe(2);

      service.dismissNotification(id1);

      expect(service.notifications().length).toBe(1);
      expect(service.notifications()[0].id).toBe(id2);
    });

    it('should not remove any notification if id does not exist', () => {
      service.showSuccess('Message 1');
      service.showError('Message 2');

      expect(service.notifications().length).toBe(2);

      service.dismissNotification('non-existent-id');

      expect(service.notifications().length).toBe(2);
    });

    it('should handle dismissing from empty notifications array', () => {
      expect(service.notifications().length).toBe(0);

      service.dismissNotification('any-id');

      expect(service.notifications().length).toBe(0);
    });
  });

  describe('clearAll', () => {
    it('should remove all notifications', () => {
      service.showSuccess('Message 1');
      service.showError('Message 2');
      service.showWarning('Message 3');
      service.showInfo('Message 4');

      expect(service.notifications().length).toBe(4);

      service.clearAll();

      expect(service.notifications().length).toBe(0);
    });

    it('should handle clearing empty notifications array', () => {
      expect(service.notifications().length).toBe(0);

      service.clearAll();

      expect(service.notifications().length).toBe(0);
    });
  });

  describe('hasNotifications computed', () => {
    it('should return false when no notifications', () => {
      expect(service.hasNotifications()).toBe(false);
    });

    it('should return true when notifications exist', () => {
      service.showSuccess('Message');
      expect(service.hasNotifications()).toBe(true);
    });

    it('should return false after clearing all notifications', () => {
      service.showSuccess('Message');
      expect(service.hasNotifications()).toBe(true);

      service.clearAll();
      expect(service.hasNotifications()).toBe(false);
    });
  });

  describe('auto-dismiss functionality', () => {
    it('should set up auto-dismiss timer for notifications with duration > 0', () => {
      const message = 'Auto dismiss message';
      const duration = 1000;

      const notificationId = service.showSuccess(message, undefined, duration);
      expect(service.notifications().length).toBe(1);

      const notification = service.notifications()[0];
      expect(notification.id).toBe(notificationId);
      expect(notification.duration).toBe(duration);
    });

    it('should not set up auto-dismiss timer for notifications with duration 0', () => {
      const message = 'No auto dismiss message';
      const duration = 0;

      const notificationId = service.showSuccess(message, undefined, duration);
      expect(service.notifications().length).toBe(1);

      const notification = service.notifications()[0];
      expect(notification.id).toBe(notificationId);
      expect(notification.duration).toBe(0);
    });

    it('should not set up auto-dismiss timer for notifications with negative duration', () => {
      const message = 'No auto dismiss message';
      const duration = -1000;

      const notificationId = service.showSuccess(message, undefined, duration);
      expect(service.notifications().length).toBe(1);

      const notification = service.notifications()[0];
      expect(notification.id).toBe(notificationId);
      expect(notification.duration).toBe(duration);
    });
  });

  describe('notification id generation', () => {
    it('should generate unique ids for different notifications', () => {
      const id1 = service.showSuccess('Message 1');
      const id2 = service.showError('Message 2');

      expect(id1).toBeTruthy();
      expect(id2).toBeTruthy();
      expect(id1).not.toBe(id2);
    });

    it('should generate ids with notification prefix', () => {
      const id = service.showSuccess('Message');

      expect(id).toMatch(/^notification-/);
    });
  });

  describe('multiple notifications', () => {
    it('should handle multiple notifications of different types', () => {
      service.showSuccess('Success message');
      service.showError('Error message');
      service.showWarning('Warning message');
      service.showInfo('Info message');

      expect(service.notifications().length).toBe(4);
      expect(service.hasNotifications()).toBe(true);

      const types = service.notifications().map((n) => n.type);
      expect(types).toContain('success');
      expect(types).toContain('error');
      expect(types).toContain('warning');
      expect(types).toContain('info');
    });

    it('should maintain order of notifications', () => {
      const id1 = service.showSuccess('First');
      const id2 = service.showError('Second');
      const id3 = service.showWarning('Third');

      const notifications = service.notifications();
      expect(notifications[0].id).toBe(id1);
      expect(notifications[1].id).toBe(id2);
      expect(notifications[2].id).toBe(id3);
    });
  });

  describe('edge cases', () => {
    it('should handle empty message', () => {
      const id = service.showSuccess('');

      expect(id).toBeTruthy();
      expect(service.notifications().length).toBe(1);
      expect(service.notifications()[0].message).toBe('');
    });

    it('should handle very long message', () => {
      const longMessage = 'A'.repeat(1000);
      const id = service.showSuccess(longMessage);

      expect(id).toBeTruthy();
      expect(service.notifications().length).toBe(1);
      expect(service.notifications()[0].message).toBe(longMessage);
    });

    it('should handle special characters in message', () => {
      const specialMessage = 'Message with special chars: !@#$%^&*()_+-=[]{}|;:,.<>?';
      const id = service.showSuccess(specialMessage);

      expect(id).toBeTruthy();
      expect(service.notifications().length).toBe(1);
      expect(service.notifications()[0].message).toBe(specialMessage);
    });
  });
});
