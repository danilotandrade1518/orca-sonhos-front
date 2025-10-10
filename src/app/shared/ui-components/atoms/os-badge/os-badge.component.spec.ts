import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { OsBadgeComponent } from './os-badge.component';
import { OsIconComponent } from '../os-icon/os-icon.component';

describe('OsBadgeComponent', () => {
  let component: OsBadgeComponent;
  let fixture: ComponentFixture<OsBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OsBadgeComponent, OsIconComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(OsBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('text', () => {
    it('should have empty text by default', () => {
      expect(component.text()).toBe('');
    });

    it('should display text when provided', () => {
      fixture.componentRef.setInput('text', 'New');
      fixture.detectChanges();
      expect(component.text()).toBe('New');
    });
  });

  describe('icon', () => {
    it('should have empty icon by default', () => {
      expect(component.icon()).toBe('');
    });

    it('should display icon when provided', () => {
      fixture.componentRef.setInput('icon', 'star');
      fixture.detectChanges();
      expect(component.icon()).toBe('star');
    });
  });

  describe('variant', () => {
    it('should apply default variant by default', () => {
      expect(component.variant()).toBe('default');
      expect(component.badgeClass()).toContain('os-badge--default');
    });

    it('should apply primary variant', () => {
      fixture.componentRef.setInput('variant', 'primary');
      fixture.detectChanges();
      expect(component.badgeClass()).toContain('os-badge--primary');
    });

    it('should apply secondary variant', () => {
      fixture.componentRef.setInput('variant', 'secondary');
      fixture.detectChanges();
      expect(component.badgeClass()).toContain('os-badge--secondary');
    });

    it('should apply success variant', () => {
      fixture.componentRef.setInput('variant', 'success');
      fixture.detectChanges();
      expect(component.badgeClass()).toContain('os-badge--success');
    });

    it('should apply warning variant', () => {
      fixture.componentRef.setInput('variant', 'warning');
      fixture.detectChanges();
      expect(component.badgeClass()).toContain('os-badge--warning');
    });

    it('should apply error variant', () => {
      fixture.componentRef.setInput('variant', 'error');
      fixture.detectChanges();
      expect(component.badgeClass()).toContain('os-badge--error');
    });

    it('should apply info variant', () => {
      fixture.componentRef.setInput('variant', 'info');
      fixture.detectChanges();
      expect(component.badgeClass()).toContain('os-badge--info');
    });
  });

  describe('size', () => {
    it('should apply medium size by default', () => {
      expect(component.size()).toBe('md');
      expect(component.badgeClass()).toContain('os-badge--md');
    });

    it('should apply small size', () => {
      fixture.componentRef.setInput('size', 'sm');
      fixture.detectChanges();
      expect(component.badgeClass()).toContain('os-badge--sm');
    });

    it('should apply large size', () => {
      fixture.componentRef.setInput('size', 'lg');
      fixture.detectChanges();
      expect(component.badgeClass()).toContain('os-badge--lg');
    });
  });

  describe('position', () => {
    it('should apply inline position by default', () => {
      expect(component.position()).toBe('inline');
      expect(component.badgeClass()).toContain('os-badge--inline');
    });

    it('should apply top-right position', () => {
      fixture.componentRef.setInput('position', 'top-right');
      fixture.detectChanges();
      expect(component.badgeClass()).toContain('os-badge--top-right');
    });

    it('should apply top-left position', () => {
      fixture.componentRef.setInput('position', 'top-left');
      fixture.detectChanges();
      expect(component.badgeClass()).toContain('os-badge--top-left');
    });

    it('should apply bottom-right position', () => {
      fixture.componentRef.setInput('position', 'bottom-right');
      fixture.detectChanges();
      expect(component.badgeClass()).toContain('os-badge--bottom-right');
    });

    it('should apply bottom-left position', () => {
      fixture.componentRef.setInput('position', 'bottom-left');
      fixture.detectChanges();
      expect(component.badgeClass()).toContain('os-badge--bottom-left');
    });
  });

  describe('dot', () => {
    it('should not be dot by default', () => {
      expect(component.dot()).toBe(false);
      expect(component.badgeClass()).not.toContain('os-badge--dot');
    });

    it('should be dot when set', () => {
      fixture.componentRef.setInput('dot', true);
      fixture.detectChanges();
      expect(component.dot()).toBe(true);
      expect(component.badgeClass()).toContain('os-badge--dot');
    });
  });

  describe('pill', () => {
    it('should not be pill by default', () => {
      expect(component.pill()).toBe(false);
      expect(component.badgeClass()).not.toContain('os-badge--pill');
    });

    it('should be pill when set', () => {
      fixture.componentRef.setInput('pill', true);
      fixture.detectChanges();
      expect(component.pill()).toBe(true);
      expect(component.badgeClass()).toContain('os-badge--pill');
    });
  });

  describe('outlined', () => {
    it('should not be outlined by default', () => {
      expect(component.outlined()).toBe(false);
      expect(component.badgeClass()).not.toContain('os-badge--outlined');
    });

    it('should be outlined when set', () => {
      fixture.componentRef.setInput('outlined', true);
      fixture.detectChanges();
      expect(component.outlined()).toBe(true);
      expect(component.badgeClass()).toContain('os-badge--outlined');
    });
  });

  describe('ariaLabel', () => {
    it('should have empty aria-label by default', () => {
      expect(component.ariaLabel()).toBe('');
    });

    it('should have aria-label when provided', () => {
      fixture.componentRef.setInput('ariaLabel', 'Notification badge');
      fixture.detectChanges();
      expect(component.ariaLabel()).toBe('Notification badge');
    });
  });

  describe('icon size mapping', () => {
    it('should map sm size to xs icon', () => {
      fixture.componentRef.setInput('size', 'sm');
      fixture.detectChanges();
      expect(component.iconSize()).toBe('xs');
    });

    it('should map md size to sm icon', () => {
      fixture.componentRef.setInput('size', 'md');
      fixture.detectChanges();
      expect(component.iconSize()).toBe('sm');
    });

    it('should map lg size to md icon', () => {
      fixture.componentRef.setInput('size', 'lg');
      fixture.detectChanges();
      expect(component.iconSize()).toBe('md');
    });
  });

  describe('icon variant mapping', () => {
    it('should use default icon variant when not outlined', () => {
      fixture.componentRef.setInput('variant', 'primary');
      fixture.componentRef.setInput('outlined', false);
      fixture.detectChanges();
      expect(component.iconVariant()).toBe('default');
    });

    it('should use badge variant for icon when outlined', () => {
      fixture.componentRef.setInput('variant', 'primary');
      fixture.componentRef.setInput('outlined', true);
      fixture.detectChanges();
      expect(component.iconVariant()).toBe('primary');
    });
  });

  describe('text class', () => {
    it('should apply default text class', () => {
      expect(component.textClass()).toBe('os-badge__text');
    });

    it('should apply outlined text class when outlined', () => {
      fixture.componentRef.setInput('outlined', true);
      fixture.detectChanges();
      expect(component.textClass()).toBe('os-badge__text os-badge__text--outlined');
    });
  });

  describe('component integration', () => {
    it('should handle multiple input changes', () => {
      fixture.componentRef.setInput('text', 'New');
      fixture.componentRef.setInput('variant', 'success');
      fixture.componentRef.setInput('size', 'lg');
      fixture.componentRef.setInput('pill', true);
      fixture.componentRef.setInput('outlined', true);
      fixture.detectChanges();

      expect(component.text()).toBe('New');
      expect(component.variant()).toBe('success');
      expect(component.size()).toBe('lg');
      expect(component.pill()).toBe(true);
      expect(component.outlined()).toBe(true);
      expect(component.badgeClass()).toContain('os-badge--success');
      expect(component.badgeClass()).toContain('os-badge--lg');
      expect(component.badgeClass()).toContain('os-badge--pill');
      expect(component.badgeClass()).toContain('os-badge--outlined');
    });

    it('should maintain state consistency', () => {
      expect(component.text()).toBe('');
      expect(component.icon()).toBe('');
      expect(component.variant()).toBe('default');
      expect(component.size()).toBe('md');
      expect(component.position()).toBe('inline');
      expect(component.dot()).toBe(false);
      expect(component.pill()).toBe(false);
      expect(component.outlined()).toBe(false);
      expect(component.ariaLabel()).toBe('');
    });
  });
});
