import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { provideZonelessChangeDetection } from '@angular/core';
import { vi } from 'vitest';

import { ThemeService, ThemeMode } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;
  let mockLocalStorage: Record<string, string>;
  let mockMatchMedia: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    
    mockLocalStorage = {};
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn((key: string) => mockLocalStorage[key] || null),
        setItem: vi.fn((key: string, value: string) => {
          mockLocalStorage[key] = value;
        }),
        removeItem: vi.fn((key: string) => {
          delete mockLocalStorage[key];
        }),
      },
      writable: true,
    });
    
    mockMatchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    Object.defineProperty(window, 'matchMedia', {
      value: mockMatchMedia,
      writable: true,
    });

    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: PLATFORM_ID, useValue: 'browser' },
        provideZonelessChangeDetection(),
      ],
    });
    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initialization', () => {
    it('should initialize with system theme by default', () => {
      expect(service.themeMode()).toBe('system');
    });

    it('should initialize with light theme when system prefers light', () => {
      
      TestBed.resetTestingModule();
      mockMatchMedia.mockImplementation((query: string) => ({
        matches: query === '(prefers-color-scheme: light)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      TestBed.configureTestingModule({
        providers: [
          ThemeService,
          { provide: PLATFORM_ID, useValue: 'browser' },
          provideZonelessChangeDetection(),
        ],
      });

      const newService = TestBed.inject(ThemeService);
      expect(newService.isDark()).toBe(false);
    });

    it('should initialize with dark theme when system prefers dark', () => {
      
      TestBed.resetTestingModule();
      mockMatchMedia.mockImplementation((query: string) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      TestBed.configureTestingModule({
        providers: [
          ThemeService,
          { provide: PLATFORM_ID, useValue: 'browser' },
          provideZonelessChangeDetection(),
        ],
      });

      const newService = TestBed.inject(ThemeService);
      expect(newService.isDark()).toBe(true);
    });

    it('should load theme from localStorage if available', () => {
      
      TestBed.resetTestingModule();
      mockLocalStorage['orca-sonhos-theme'] = 'dark';

      TestBed.configureTestingModule({
        providers: [
          ThemeService,
          { provide: PLATFORM_ID, useValue: 'browser' },
          provideZonelessChangeDetection(),
        ],
      });

      const newService = TestBed.inject(ThemeService);
      expect(newService.themeMode()).toBe('dark');
      expect(newService.isDark()).toBe(true);
    });

    it('should not access localStorage on server platform', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          ThemeService,
          { provide: PLATFORM_ID, useValue: 'server' },
          provideZonelessChangeDetection(),
        ],
      });

      const serverService = TestBed.inject(ThemeService);
      expect(serverService.themeMode()).toBe('system');
    });
  });

  describe('theme mode management', () => {
    it('should set theme mode to light', () => {
      service.setThemeMode('light');

      expect(service.themeMode()).toBe('light');
      expect(service.isDark()).toBe(false);
      expect(service.currentTheme()).toBe('light');
    });

    it('should set theme mode to dark', () => {
      service.setThemeMode('dark');

      expect(service.themeMode()).toBe('dark');
      expect(service.isDark()).toBe(true);
      expect(service.currentTheme()).toBe('dark');
    });

    it('should set theme mode to system', () => {
      service.setThemeMode('system');

      expect(service.themeMode()).toBe('system');
      
      expect(service.isDark()).toBe(true);
    });

    it('should persist theme mode to localStorage', () => {
      service.setThemeMode('dark');

      expect(localStorage.setItem).toHaveBeenCalledWith('orca-sonhos-theme', 'dark');
    });

    it('should not persist to localStorage on server platform', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          ThemeService,
          { provide: PLATFORM_ID, useValue: 'server' },
          provideZonelessChangeDetection(),
        ],
      });

      const serverService = TestBed.inject(ThemeService);
      serverService.setThemeMode('dark');

      expect(localStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe('theme toggle', () => {
    it('should toggle from light to dark', () => {
      service.setThemeMode('light');
      service.toggleTheme();

      expect(service.themeMode()).toBe('dark');
      expect(service.isDark()).toBe(true);
    });

    it('should toggle from dark to light', () => {
      service.setThemeMode('dark');
      service.toggleTheme();

      expect(service.themeMode()).toBe('light');
      expect(service.isDark()).toBe(false);
    });

    it('should toggle from system to light when system is dark', () => {
      mockMatchMedia.mockImplementation((query: string) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      service.setThemeMode('system');
      service.toggleTheme();

      expect(service.themeMode()).toBe('light');
      expect(service.isDark()).toBe(false);
    });

    it('should toggle from system to dark when system is light', () => {
      mockMatchMedia.mockImplementation((query: string) => ({
        matches: query === '(prefers-color-scheme: light)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      service.setThemeMode('system');
      service.toggleTheme();

      expect(service.themeMode()).toBe('dark');
      expect(service.isDark()).toBe(true);
    });
  });

  describe('computed properties', () => {
    it('should return correct current theme', () => {
      service.setThemeMode('dark');
      expect(service.currentTheme()).toBe('dark');

      service.setThemeMode('light');
      expect(service.currentTheme()).toBe('light');
    });

    it('should return readonly signals', () => {
      const themeModeSignal = service.themeMode;
      const isDarkSignal = service.isDark;
      const currentThemeSignal = service.currentTheme;

      expect(themeModeSignal).toBeDefined();
      expect(isDarkSignal).toBeDefined();
      expect(currentThemeSignal).toBeDefined();
    });
  });

  describe('system theme listener', () => {
    it('should update theme when system preference changes', () => {
      service.setThemeMode('system');
      
      const mockAddEventListener = vi.fn();
      const mockMediaQuery = {
        matches: true,
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: mockAddEventListener,
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      };
      
      mockMatchMedia.mockReturnValue(mockMediaQuery);
      
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          ThemeService,
          { provide: PLATFORM_ID, useValue: 'browser' },
          provideZonelessChangeDetection(),
        ],
      });

      const newService = TestBed.inject(ThemeService);
      newService.setThemeMode('system');
      
      expect(mockAddEventListener).toHaveBeenCalled();
    });
  });

  describe('DOM manipulation', () => {
    it('should apply dark theme to document', () => {
      service.setThemeMode('dark');

      expect(document.documentElement.classList.contains('dark-theme')).toBe(true);
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('should apply light theme to document', () => {
      service.setThemeMode('light');

      expect(document.documentElement.classList.contains('light-theme')).toBe(true);
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    it('should apply system theme to document', () => {
      service.setThemeMode('system');
      
      const expectedTheme = 'dark';
      expect(document.documentElement.getAttribute('data-theme')).toBe(expectedTheme);
    });
  });

  describe('edge cases', () => {
    it('should handle invalid theme mode gracefully', () => {
      const invalidMode = 'invalid' as ThemeMode;
      service.setThemeMode(invalidMode);
      
      expect(service.themeMode()).toBe(invalidMode);
    });

    it('should handle localStorage errors gracefully', () => {
      
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: vi.fn(() => {
            throw new Error('localStorage error');
          }),
          setItem: vi.fn(() => {
            throw new Error('localStorage error');
          }),
          removeItem: vi.fn(),
        },
        writable: true,
      });
      
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          ThemeService,
          { provide: PLATFORM_ID, useValue: 'browser' },
          provideZonelessChangeDetection(),
        ],
      });
      
      expect(() => {
        const newService = TestBed.inject(ThemeService);
        newService.setThemeMode('dark');
      }).not.toThrow();
    });

    it('should handle missing matchMedia gracefully', () => {
      
      Object.defineProperty(window, 'matchMedia', {
        value: undefined,
        writable: true,
      });
      
      expect(() => {
        TestBed.inject(ThemeService);
      }).not.toThrow();
    });
  });
});
