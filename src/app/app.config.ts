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

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error/error.interceptor';

const firebaseConfig = {
  apiKey: 'AIzaSyCkQKwFo-txr5p7v_rMM56Tznj4V8vA9tc',
  authDomain: 'orca-sonhos.firebaseapp.com',
  projectId: 'orca-sonhos',
  storageBucket: 'orca-sonhos.firebasestorage.app',
  messagingSenderId: '211253976316',
  appId: '1:211253976316:web:7d7981947785a2fa400b79',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
  ],
};
