import { Injectable, signal, computed, inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type ThemeMode = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root',
})
export class ThemeService implements OnDestroy {
  private mediaQueryRef: MediaQueryList | null = null;
  private mediaQueryHandler: ((e: MediaQueryListEvent) => void) | null = null;
  private readonly platformId = inject(PLATFORM_ID);
  private readonly storageKey = 'orca-sonhos-theme';

  private readonly _themeMode = signal<ThemeMode>('system');
  private readonly _isDark = signal<boolean>(false);

  readonly themeMode = this._themeMode.asReadonly();
  readonly isDark = this._isDark.asReadonly();
  readonly currentTheme = computed(() => (this.isDark() ? 'dark' : 'light'));

  constructor() {
    this.initializeTheme();
    this.setupSystemThemeListener();
  }

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
      this._themeMode.set('system');
      this.applyTheme('system');
    }
  }

  private setupSystemThemeListener(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.mediaQueryRef = mediaQuery;

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (this._themeMode() === 'system') {
        this._isDark.set(e.matches);
        this.updateDocumentTheme();
      }
    };
    this.mediaQueryHandler = handleSystemThemeChange;

    mediaQuery.addEventListener('change', handleSystemThemeChange);

    if (this._themeMode() === 'system') {
      this._isDark.set(mediaQuery.matches);
      this.updateDocumentTheme();
    }
  }

  setThemeMode(mode: ThemeMode): void {
    this._themeMode.set(mode);
    this.applyTheme(mode);

    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem(this.storageKey, mode);
      } catch (error) {
        console.warn('Failed to persist theme to localStorage:', error);
      }
    }
  }

  toggleTheme(): void {
    const currentMode = this._themeMode();

    if (currentMode === 'system') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setThemeMode(systemPrefersDark ? 'light' : 'dark');
    } else {
      this.setThemeMode(currentMode === 'light' ? 'dark' : 'light');
    }
  }

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

  private updateDocumentTheme(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const isDark = this._isDark();
    const htmlElement = document.documentElement;

    htmlElement.classList.remove('light-theme', 'dark-theme');

    htmlElement.classList.add(`${isDark ? 'dark' : 'light'}-theme`);

    htmlElement.setAttribute('data-theme', isDark ? 'dark' : 'light');

    htmlElement.style.colorScheme = isDark ? 'dark' : 'light';
  }

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

  isCurrentlyDark(): boolean {
    return this._isDark();
  }

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

  ngOnDestroy(): void {
    if (this.mediaQueryRef && this.mediaQueryHandler) {
      try {
        this.mediaQueryRef.removeEventListener('change', this.mediaQueryHandler);
      } catch {
        console.warn('Failed to remove media query listener');
      }
    }
    this.mediaQueryRef = null;
    this.mediaQueryHandler = null;
  }
}
