import { Environment } from './environment.interface';

export const environment: Environment = {
  production: true,
  apiUrl: 'https://api.orca-sonhos.com',
  version: '1.0.0',
  debug: false,
  enableLogging: false,
  firebase: {
    apiKey: 'AIzaSyCkQKwFo-txr5p7v_rMM56Tznj4V8vA9tc',
    authDomain: 'orca-sonhos.firebaseapp.com',
    projectId: 'orca-sonhos',
    storageBucket: 'orca-sonhos.firebasestorage.app',
    messagingSenderId: '211253976316',
    appId: '1:211253976316:web:7d7981947785a2fa400b79',
  },
  features: {
    offlineMode: false,
    analytics: true,
    errorReporting: true,
  },
};
