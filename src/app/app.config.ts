import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error/error.interceptor';
import { EXTERNAL_AUTH_SERVICE_ADAPTER } from './core/adapters/external-auth-service.adapter';
import { FirebaseAuthServiceAdapter } from '../infra/firebase/firebase-auth-service-adapter';
import { MockAuthServiceAdapter } from '../infra/mock/mock-auth-service-adapter';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideCharts(withDefaultRegisterables()),
    {
      provide: EXTERNAL_AUTH_SERVICE_ADAPTER,
      useClass: environment.authBypass ? MockAuthServiceAdapter : FirebaseAuthServiceAdapter,
    },
  ],
};
