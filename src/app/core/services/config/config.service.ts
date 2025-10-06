import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private readonly env = environment;

  get apiUrl(): string {
    return this.env.apiUrl;
  }

  get production(): boolean {
    return this.env.production;
  }

  get appName(): string {
    return this.env.appName;
  }

  get version(): string {
    return this.env.version;
  }

  get enableMSW(): boolean {
    return this.env.enableMSW;
  }

  get enableDebugLogs(): boolean {
    return this.env.enableDebugLogs;
  }
}
