import { HttpClient } from '@infra/http/HttpClient';

export interface HttpClientOptions {
  baseUrl: string;
  getAccessToken?: () => string | null | undefined; // tokens em memória
}

export class FetchHttpClient implements HttpClient {
  constructor(private readonly options: HttpClientOptions) {}

  private headers(extra?: HeadersInit): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((extra as Record<string, string>) ?? {}),
    };
    const token = this.options.getAccessToken?.();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  }

  async get<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${this.options.baseUrl}${path}`, {
      ...init,
      method: 'GET',
      headers: this.headers(init?.headers),
    });
    if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
    return (await res.json()) as T;
  }

  async post<T>(path: string, body: unknown, init?: RequestInit): Promise<T> {
    const res = await fetch(`${this.options.baseUrl}${path}`, {
      ...init,
      method: 'POST',
      headers: this.headers(init?.headers),
      body: JSON.stringify(body ?? {}),
    });
    if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
    if (res.status === 204) return undefined as unknown as T;
    return (await res.json().catch(() => undefined)) as T;
  }
}
