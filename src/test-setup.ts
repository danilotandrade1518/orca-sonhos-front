import { TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

/**
 * Configuração global do ambiente de testes Angular para Vitest.
 * É executado uma única vez antes de qualquer spec.
 */
try {
  TestBed.initTestEnvironment(
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting(),
  );
} catch {
  // Ambiente já foi inicializado (evita erro em execuções múltiplas).
}


