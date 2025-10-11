export interface Environment {
  production: boolean;
  apiUrl: string;
  version: string;
  debug: boolean;
  enableLogging: boolean;
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
  features: Record<string, boolean>;
}
