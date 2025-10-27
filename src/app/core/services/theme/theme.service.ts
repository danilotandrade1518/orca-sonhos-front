import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type ThemeMode = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly storageKey = 'orca-sonhos-theme';

  // Signals for theme state
  private readonly _themeMode = signal<ThemeMode>('system');
  private readonly _isDark = signal<boolean>(false);

  // Computed properties
  readonly themeMode = this._themeMode.asReadonly();
  readonly isDark = this._isDark.asReadonly();
  readonly currentTheme = computed(() => (this.isDark() ? 'dark' : 'light'));

  constructor() {
    this.initializeTheme();
    this.setupSystemThemeListener();
  }

  /**
   * Initialize theme from localStorage or system preference
   */
  private initializeTheme(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      const savedTheme = localStorage.getItem(this.storageKey) as ThemeMode;
      const themeMode = savedTheme || 'system';

      this._themeMode.set(themeMode);
      this.applyTheme(themeMode);
    } catch {
      // Fallback to system theme if localStorage fails
      this._themeMode.set('system');
      this.applyTheme('system');
    }
  }

  /**
   * Setup listener for system theme changes
   */
  private setupSystemThemeListener(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (this._themeMode() === 'system') {
        this._isDark.set(e.matches);
        this.updateDocumentTheme();
      }
    };

    // Listen for system theme changes
    mediaQuery.addEventListener('change', handleSystemThemeChange);

    // Set initial system theme
    if (this._themeMode() === 'system') {
      this._isDark.set(mediaQuery.matches);
      this.updateDocumentTheme();
    }
  }

  /**
   * Set theme mode and persist to localStorage
   */
  setThemeMode(mode: ThemeMode): void {
    this._themeMode.set(mode);
    this.applyTheme(mode);

    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem(this.storageKey, mode);
      } catch (error) {
        // Ignore localStorage errors, theme will still work
        console.warn('Failed to persist theme to localStorage:', error);
      }
    }
  }

  /**
   * Toggle between light and dark themes
   */
  toggleTheme(): void {
    const currentMode = this._themeMode();

    if (currentMode === 'system') {
      // If system, toggle to opposite of current system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setThemeMode(systemPrefersDark ? 'light' : 'dark');
    } else {
      // Toggle between light and dark
      this.setThemeMode(currentMode === 'light' ? 'dark' : 'light');
    }
  }

  /**
   * Apply theme based on mode
   */
  private applyTheme(mode: ThemeMode): void {
    switch (mode) {
      case 'light':
        this._isDark.set(false);
        break;
      case 'dark':
        this._isDark.set(true);
        break;
      case 'system':
        if (isPlatformBrowser(this.platformId)) {
          const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          this._isDark.set(systemPrefersDark);
        }
        break;
    }

    this.updateDocumentTheme();
  }

  /**
   * Update document theme classes and attributes
   */
  private updateDocumentTheme(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const isDark = this._isDark();
    const htmlElement = document.documentElement;

    // Remove existing theme classes
    htmlElement.classList.remove('light-theme', 'dark-theme');

    // Add new theme class
    htmlElement.classList.add(`${isDark ? 'dark' : 'light'}-theme`);

    // Set data attribute for CSS custom properties
    htmlElement.setAttribute('data-theme', isDark ? 'dark' : 'light');

    // Set color-scheme for browser UI
    htmlElement.style.colorScheme = isDark ? 'dark' : 'light';
  }

  /**
   * Get theme mode display name
   */
  getThemeModeDisplayName(mode: ThemeMode): string {
    switch (mode) {
      case 'light':
        return 'Claro';
      case 'dark':
        return 'Escuro';
      case 'system':
        return 'Sistema';
      default:
        return 'Sistema';
    }
  }

  /**
   * Get theme icon name
   */
  getThemeIcon(mode: ThemeMode): string {
    switch (mode) {
      case 'light':
        return 'light-mode';
      case 'dark':
        return 'dark-mode';
      case 'system':
        return 'brightness-auto';
      default:
        return 'brightness-auto';
    }
  }

  /**
   * Check if theme is currently dark
   */
  isCurrentlyDark(): boolean {
    return this._isDark();
  }

  /**
   * Get next theme mode in cycle
   */
  getNextThemeMode(): ThemeMode {
    const current = this._themeMode();
    switch (current) {
      case 'light':
        return 'dark';
      case 'dark':
        return 'system';
      case 'system':
        return 'light';
      default:
        return 'system';
    }
  }
}
