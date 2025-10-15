import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { OsAvatarComponent } from './os-avatar.component';
import { OsIconComponent } from '../os-icon/os-icon.component';
import { OsBadgeComponent } from '../os-badge/os-badge.component';

describe('OsAvatarComponent', () => {
  let component: OsAvatarComponent;
  let fixture: ComponentFixture<OsAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OsAvatarComponent, OsIconComponent, OsBadgeComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(OsAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('image', () => {
    it('should have empty image by default', () => {
      expect(component.image()).toBe('');
    });

    it('should display image when provided', () => {
      fixture.componentRef.setInput('image', 'https://example.com/avatar.jpg');
      fixture.detectChanges();
      expect(component.image()).toBe('https://example.com/avatar.jpg');
    });
  });

  describe('initials', () => {
    it('should have empty initials by default', () => {
      expect(component.initials()).toBe('');
    });

    it('should display initials when provided', () => {
      fixture.componentRef.setInput('initials', 'JD');
      fixture.detectChanges();
      expect(component.initials()).toBe('JD');
    });
  });

  describe('size', () => {
    it('should apply medium size by default', () => {
      expect(component.size()).toBe('md');
      expect(component.avatarClass()).toContain('os-avatar--md');
    });

    it('should apply xs size', () => {
      fixture.componentRef.setInput('size', 'xs');
      fixture.detectChanges();
      expect(component.avatarClass()).toContain('os-avatar--xs');
    });

    it('should apply sm size', () => {
      fixture.componentRef.setInput('size', 'sm');
      fixture.detectChanges();
      expect(component.avatarClass()).toContain('os-avatar--sm');
    });

    it('should apply lg size', () => {
      fixture.componentRef.setInput('size', 'lg');
      fixture.detectChanges();
      expect(component.avatarClass()).toContain('os-avatar--lg');
    });

    it('should apply xl size', () => {
      fixture.componentRef.setInput('size', 'xl');
      fixture.detectChanges();
      expect(component.avatarClass()).toContain('os-avatar--xl');
    });

    it('should apply 2xl size', () => {
      fixture.componentRef.setInput('size', '2xl');
      fixture.detectChanges();
      expect(component.avatarClass()).toContain('os-avatar--2xl');
    });
  });

  describe('variant', () => {
    it('should apply circle variant by default', () => {
      expect(component.variant()).toBe('circle');
      expect(component.avatarClass()).toContain('os-avatar--circle');
    });

    it('should apply square variant', () => {
      fixture.componentRef.setInput('variant', 'square');
      fixture.detectChanges();
      expect(component.avatarClass()).toContain('os-avatar--square');
    });

    it('should apply rounded variant', () => {
      fixture.componentRef.setInput('variant', 'rounded');
      fixture.detectChanges();
      expect(component.avatarClass()).toContain('os-avatar--rounded');
    });
  });

  describe('alt', () => {
    it('should have empty alt by default', () => {
      expect(component.alt()).toBe('');
    });

    it('should have alt when provided', () => {
      fixture.componentRef.setInput('alt', 'John Doe avatar');
      fixture.detectChanges();
      expect(component.alt()).toBe('John Doe avatar');
    });
  });

  describe('accessibility', () => {
    it('should have empty aria-label by default', () => {
      expect(component.ariaLabel()).toBe('');
    });

    it('should have aria-label when provided', () => {
      fixture.componentRef.setInput('ariaLabel', 'User avatar');
      fixture.detectChanges();
      expect(component.ariaLabel()).toBe('User avatar');
    });

    it('should have empty title by default', () => {
      expect(component.title()).toBe('');
    });

    it('should have title when provided', () => {
      fixture.componentRef.setInput('title', 'John Doe');
      fixture.detectChanges();
      expect(component.title()).toBe('John Doe');
    });
  });

  describe('badge', () => {
    it('should not have badge by default', () => {
      expect(component.badge()).toBe(false);
      expect(component.avatarClass()).not.toContain('os-avatar--with-badge');
    });

    it('should have badge when set', () => {
      fixture.componentRef.setInput('badge', true);
      fixture.detectChanges();
      expect(component.badge()).toBe(true);
      expect(component.avatarClass()).toContain('os-avatar--with-badge');
    });

    it('should have empty badge text by default', () => {
      expect(component.badgeText()).toBe('');
    });

    it('should have badge text when provided', () => {
      fixture.componentRef.setInput('badgeText', '3');
      fixture.detectChanges();
      expect(component.badgeText()).toBe('3');
    });

    it('should apply default badge variant by default', () => {
      expect(component.badgeVariant()).toBe('default');
    });

    it('should apply badge variant when provided', () => {
      fixture.componentRef.setInput('badgeVariant', 'success');
      fixture.detectChanges();
      expect(component.badgeVariant()).toBe('success');
    });
  });

  describe('icon size mapping', () => {
    it('should map xs size to sm icon', () => {
      fixture.componentRef.setInput('size', 'xs');
      fixture.detectChanges();
      expect(component.iconSize()).toBe('sm');
    });

    it('should map sm size to sm icon', () => {
      fixture.componentRef.setInput('size', 'sm');
      fixture.detectChanges();
      expect(component.iconSize()).toBe('sm');
    });

    it('should map md size to md icon', () => {
      fixture.componentRef.setInput('size', 'md');
      fixture.detectChanges();
      expect(component.iconSize()).toBe('md');
    });

    it('should map lg size to lg icon', () => {
      fixture.componentRef.setInput('size', 'lg');
      fixture.detectChanges();
      expect(component.iconSize()).toBe('lg');
    });

    it('should map xl size to xl icon', () => {
      fixture.componentRef.setInput('size', 'xl');
      fixture.detectChanges();
      expect(component.iconSize()).toBe('xl');
    });

    it('should map 2xl size to xl icon', () => {
      fixture.componentRef.setInput('size', '2xl');
      fixture.detectChanges();
      expect(component.iconSize()).toBe('xl');
    });
  });

  describe('badge size mapping', () => {
    it('should map xs size to sm badge', () => {
      fixture.componentRef.setInput('size', 'xs');
      fixture.detectChanges();
      expect(component.badgeSize()).toBe('sm');
    });

    it('should map sm size to sm badge', () => {
      fixture.componentRef.setInput('size', 'sm');
      fixture.detectChanges();
      expect(component.badgeSize()).toBe('sm');
    });

    it('should map md size to sm badge', () => {
      fixture.componentRef.setInput('size', 'md');
      fixture.detectChanges();
      expect(component.badgeSize()).toBe('sm');
    });

    it('should map lg size to md badge', () => {
      fixture.componentRef.setInput('size', 'lg');
      fixture.detectChanges();
      expect(component.badgeSize()).toBe('md');
    });

    it('should map xl size to md badge', () => {
      fixture.componentRef.setInput('size', 'xl');
      fixture.detectChanges();
      expect(component.badgeSize()).toBe('md');
    });

    it('should map 2xl size to lg badge', () => {
      fixture.componentRef.setInput('size', '2xl');
      fixture.detectChanges();
      expect(component.badgeSize()).toBe('lg');
    });
  });

  describe('image class', () => {
    it('should apply default image class', () => {
      expect(component.imageClass()).toBe('os-avatar__image os-avatar__image--circle');
    });

    it('should apply circle image class', () => {
      fixture.componentRef.setInput('variant', 'circle');
      fixture.detectChanges();
      expect(component.imageClass()).toBe('os-avatar__image os-avatar__image--circle');
    });

    it('should apply square image class', () => {
      fixture.componentRef.setInput('variant', 'square');
      fixture.detectChanges();
      expect(component.imageClass()).toBe('os-avatar__image os-avatar__image--square');
    });

    it('should apply rounded image class', () => {
      fixture.componentRef.setInput('variant', 'rounded');
      fixture.detectChanges();
      expect(component.imageClass()).toBe('os-avatar__image os-avatar__image--rounded');
    });
  });

  describe('initials class', () => {
    it('should apply default initials class', () => {
      expect(component.initialsClass()).toBe('os-avatar__initials os-avatar__initials--md');
    });

    it('should apply size-specific initials class', () => {
      fixture.componentRef.setInput('size', 'lg');
      fixture.detectChanges();
      expect(component.initialsClass()).toBe('os-avatar__initials os-avatar__initials--lg');
    });
  });

  describe('image error handling', () => {
    it('should handle image error', () => {
      expect((component as unknown as { _imageError: boolean })._imageError).toBe(false);
      component.handleImageError();
      expect((component as unknown as { _imageError: boolean })._imageError).toBe(true);
    });

    it('should handle image load', () => {
      (component as unknown as { _imageError: boolean })._imageError = true;
      component.handleImageLoad();
      expect((component as unknown as { _imageError: boolean })._imageError).toBe(false);
    });
  });

  describe('new features', () => {
    describe('images array', () => {
      it('should have empty images array by default', () => {
        expect(component.images()).toEqual([]);
      });

      it('should display first image when images array provided', () => {
        fixture.componentRef.setInput('images', ['image1.jpg', 'image2.jpg']);
        fixture.detectChanges();
        expect(component.images()).toEqual(['image1.jpg', 'image2.jpg']);
        expect(component.currentImageIndex()).toBe(0);
      });
    });

    describe('status', () => {
      it('should have offline status by default', () => {
        expect(component.status()).toBe('offline');
      });

      it('should apply online status', () => {
        fixture.componentRef.setInput('status', 'online');
        fixture.detectChanges();
        expect(component.status()).toBe('online');
        expect(component.avatarClass()).toContain('os-avatar--status-online');
      });

      it('should apply away status', () => {
        fixture.componentRef.setInput('status', 'away');
        fixture.detectChanges();
        expect(component.status()).toBe('away');
        expect(component.avatarClass()).toContain('os-avatar--status-away');
      });

      it('should apply busy status', () => {
        fixture.componentRef.setInput('status', 'busy');
        fixture.detectChanges();
        expect(component.status()).toBe('busy');
        expect(component.avatarClass()).toContain('os-avatar--status-busy');
      });
    });

    describe('loading state', () => {
      it('should not be loading by default', () => {
        expect(component.loading()).toBe(false);
      });

      it('should apply loading state', () => {
        fixture.componentRef.setInput('loading', true);
        fixture.detectChanges();
        expect(component.loading()).toBe(true);
        expect(component.avatarClass()).toContain('os-avatar--loading');
      });
    });

    describe('clickable state', () => {
      it('should not be clickable by default', () => {
        expect(component.clickable()).toBe(false);
      });

      it('should apply clickable state', () => {
        fixture.componentRef.setInput('clickable', true);
        fixture.detectChanges();
        expect(component.clickable()).toBe(true);
        expect(component.avatarClass()).toContain('os-avatar--clickable');
      });
    });

    describe('role', () => {
      it('should have img role by default', () => {
        expect(component.role()).toBe('img');
      });

      it('should apply button role when clickable', () => {
        fixture.componentRef.setInput('clickable', true);
        fixture.detectChanges();
        expect(component.avatarRole()).toBe('button');
      });

      it('should apply custom role', () => {
        fixture.componentRef.setInput('role', 'presentation');
        fixture.detectChanges();
        expect(component.role()).toBe('presentation');
        expect(component.avatarRole()).toBe('presentation');
      });
    });

    describe('optimized initials', () => {
      it('should optimize single word initials', () => {
        fixture.componentRef.setInput('initials', 'John');
        fixture.detectChanges();
        expect(component.optimizedInitials()).toBe('JO');
      });

      it('should optimize multiple word initials', () => {
        fixture.componentRef.setInput('initials', 'John Doe');
        fixture.detectChanges();
        expect(component.optimizedInitials()).toBe('JD');
      });

      it('should handle empty initials', () => {
        fixture.componentRef.setInput('initials', '');
        fixture.detectChanges();
        expect(component.optimizedInitials()).toBe('');
      });

      it('should handle single character', () => {
        fixture.componentRef.setInput('initials', 'J');
        fixture.detectChanges();
        expect(component.optimizedInitials()).toBe('J');
      });
    });

    describe('status label', () => {
      it('should return correct status labels', () => {
        const statusLabels = {
          online: 'Online',
          offline: 'Offline',
          away: 'Ausente',
          busy: 'Ocupado',
          invisible: 'Invisível',
        };

        Object.entries(statusLabels).forEach(([status, label]) => {
          fixture.componentRef.setInput('status', status as any);
          fixture.detectChanges();
          expect(component.statusLabel()).toBe(label);
        });
      });
    });

    describe('image navigation', () => {
      it('should navigate to next image', () => {
        fixture.componentRef.setInput('images', ['img1.jpg', 'img2.jpg', 'img3.jpg']);
        fixture.detectChanges();

        expect(component.currentImageIndex()).toBe(0);
        component.nextImage(new Event('click'));
        expect(component.currentImageIndex()).toBe(1);
        component.nextImage(new Event('click'));
        expect(component.currentImageIndex()).toBe(2);
        component.nextImage(new Event('click'));
        expect(component.currentImageIndex()).toBe(0); // Should wrap around
      });

      it('should navigate to previous image', () => {
        fixture.componentRef.setInput('images', ['img1.jpg', 'img2.jpg', 'img3.jpg']);
        fixture.detectChanges();

        expect(component.currentImageIndex()).toBe(0);
        component.previousImage(new Event('click'));
        expect(component.currentImageIndex()).toBe(2); // Should wrap around
        component.previousImage(new Event('click'));
        expect(component.currentImageIndex()).toBe(1);
      });

      it('should not navigate with single image', () => {
        fixture.componentRef.setInput('images', ['img1.jpg']);
        fixture.detectChanges();

        expect(component.currentImageIndex()).toBe(0);
        component.nextImage(new Event('click'));
        expect(component.currentImageIndex()).toBe(0);
        component.previousImage(new Event('click'));
        expect(component.currentImageIndex()).toBe(0);
      });
    });

    describe('click handling', () => {
      it('should handle click when clickable', () => {
        fixture.componentRef.setInput('clickable', true);
        fixture.detectChanges();

        expect(() => component.handleClick()).not.toThrow();
      });

      it('should not handle click when not clickable', () => {
        fixture.componentRef.setInput('clickable', false);
        fixture.detectChanges();

        expect(() => component.handleClick()).not.toThrow();
      });
    });
  });

  describe('component integration', () => {
    it('should handle multiple input changes', () => {
      fixture.componentRef.setInput('image', 'https://example.com/avatar.jpg');
      fixture.componentRef.setInput('size', 'lg');
      fixture.componentRef.setInput('variant', 'rounded');
      fixture.componentRef.setInput('badge', true);
      fixture.componentRef.setInput('badgeText', '5');
      fixture.componentRef.setInput('badgeVariant', 'success');
      fixture.detectChanges();

      expect(component.image()).toBe('https://example.com/avatar.jpg');
      expect(component.size()).toBe('lg');
      expect(component.variant()).toBe('rounded');
      expect(component.badge()).toBe(true);
      expect(component.badgeText()).toBe('5');
      expect(component.badgeVariant()).toBe('success');
      expect(component.avatarClass()).toContain('os-avatar--lg');
      expect(component.avatarClass()).toContain('os-avatar--rounded');
      expect(component.avatarClass()).toContain('os-avatar--with-badge');
    });

    it('should maintain state consistency', () => {
      expect(component.image()).toBe('');
      expect(component.images()).toEqual([]);
      expect(component.initials()).toBe('');
      expect(component.alt()).toBe('');
      expect(component.size()).toBe('md');
      expect(component.variant()).toBe('circle');
      expect(component.status()).toBe('offline');
      expect(component.role()).toBe('img');
      expect(component.loading()).toBe(false);
      expect(component.clickable()).toBe(false);
      expect(component.ariaLabel()).toBe('');
      expect(component.title()).toBe('');
      expect(component.badge()).toBe(false);
      expect(component.badgeText()).toBe('');
      expect(component.badgeVariant()).toBe('default');
    });
  });
});
