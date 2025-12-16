import { provideZoneChangeDetection, NgModule } from "@angular/core";
import { TestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';

@NgModule({ providers: [ provideZoneChangeDetection() ] })
export class ZoneChangeDetectionModule {}


try {
  TestBed.initTestEnvironment([ZoneChangeDetectionModule, BrowserTestingModule], platformBrowserTesting());
} catch {
  console.log('Ambiente de testes já inicializado');
}
