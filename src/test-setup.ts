import { TestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';

try {
  TestBed.initTestEnvironment(BrowserTestingModule, platformBrowserTesting());
} catch {
  console.log('Ambiente de testes já inicializado');
}
