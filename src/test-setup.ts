import { provideZonelessChangeDetection, NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';

@NgModule({ providers: [provideZonelessChangeDetection()] })
export class ZonelessChangeDetectionModule {}

try {
  TestBed.initTestEnvironment(
    [ZonelessChangeDetectionModule, BrowserTestingModule],
    platformBrowserTesting()
  );
} catch {
  console.log('Ambiente de testes já inicializado');
}
