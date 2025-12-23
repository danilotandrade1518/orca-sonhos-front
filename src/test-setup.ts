import { provideZonelessChangeDetection, NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';

@NgModule({ providers: [provideZonelessChangeDetection()] })
export class ZonelessChangeDetectionModule {}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(HTMLCanvasElement.prototype as any).getContext = () => null;

const originalConsoleError = console.error.bind(console);
console.error = (...args: unknown[]) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes("Failed to create chart: can't acquire context")
  ) {
    return;
  }
  originalConsoleError(...args);
};

try {
  TestBed.initTestEnvironment(
    [ZonelessChangeDetectionModule, BrowserTestingModule],
    platformBrowserTesting()
  );
} catch {
  console.log('Ambiente de testes já inicializado');
}
