import { Injectable, signal, computed } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
}

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private readonly _isDevelopment = signal(environment.production === false);
  private readonly _apiConfig = signal<ApiConfig>({
    baseUrl: environment.apiUrl || 'http://localhost:3000/api',
    timeout: 30000,
    retryAttempts: 3,
  });
  private readonly _firebaseConfig = signal<FirebaseConfig>({
    apiKey: environment.firebase.apiKey,
    authDomain: environment.firebase.authDomain,
    projectId: environment.firebase.projectId,
    storageBucket: environment.firebase.storageBucket,
    messagingSenderId: environment.firebase.messagingSenderId,
    appId: environment.firebase.appId,
  });

  readonly isDevelopment = this._isDevelopment.asReadonly();
  readonly apiConfig = this._apiConfig.asReadonly();
  readonly firebaseConfig = this._firebaseConfig.asReadonly();

  readonly apiBaseUrl = computed(() => this.apiConfig().baseUrl);
  readonly apiTimeout = computed(() => this.apiConfig().timeout);
  readonly apiRetryAttempts = computed(() => this.apiConfig().retryAttempts);

  getApiUrl(endpoint: string): string {
    const baseUrl = this.apiBaseUrl();
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return `${baseUrl}/${cleanEndpoint}`;
  }

  isFeatureEnabled(feature: string): boolean {
    if (this.isDevelopment()) {
      return true;
    }

    return environment.features?.[feature] ?? false;
  }

  getEnvironmentVariable(key: string): string | undefined {
    return (environment as unknown as Record<string, unknown>)[key] as string | undefined;
  }
}
