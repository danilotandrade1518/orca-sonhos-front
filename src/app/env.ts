// Centralized environment/config used by the app (no secrets).
// Adjust per environment (DEV/QA/PRD) during build or via file replacement if set up.

export const ENV = {
  // Feature flags
  AUTH_DISABLED: true,

  // Backend API base. Prefer a relative "/api" with dev proxy, or set absolute URL.
  API_BASE_URL: '/api',

  // Firebase configuration (public keys; not secrets)
  FIREBASE: {
    apiKey: 'AIzaSyCkQKwFo-txr5p7v_rMM56Tznj4V8vA9tc',
    authDomain: 'orca-sonhos.firebaseapp.com',
    projectId: 'orca-sonhos',
    storageBucket: 'orca-sonhos.firebasestorage.app',
    messagingSenderId: '211253976316',
    appId: '1:211253976316:web:7d7981947785a2fa400b79',
  },
} as const;
