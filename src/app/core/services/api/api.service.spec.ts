import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { ConfigService } from '../config/config.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  let configService: ConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
    configService = TestBed.inject(ConfigService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make GET request', async () => {
    const endpoint = '/test';
    const mockResponse = { data: 'test' };

    const promise = service.get<typeof mockResponse>(endpoint);

    const req = httpMock.expectOne(`${configService.apiUrl}${endpoint}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    const response = await promise;
    expect(response).toEqual(mockResponse);
  });

  it('should make POST request', async () => {
    const endpoint = '/test';
    const body = { name: 'test' };
    const mockResponse = { id: '1', ...body };

    const promise = service.post<typeof mockResponse>(endpoint, body);

    const req = httpMock.expectOne(`${configService.apiUrl}${endpoint}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(body);
    req.flush(mockResponse);

    const response = await promise;
    expect(response).toEqual(mockResponse);
  });

  it('should make PUT request', async () => {
    const endpoint = '/test/1';
    const body = { name: 'updated' };
    const mockResponse = { id: '1', ...body };

    const promise = service.put<typeof mockResponse>(endpoint, body);

    const req = httpMock.expectOne(`${configService.apiUrl}${endpoint}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(body);
    req.flush(mockResponse);

    const response = await promise;
    expect(response).toEqual(mockResponse);
  });

  it('should make DELETE request', async () => {
    const endpoint = '/test/1';
    const mockResponse = { success: true };

    const promise = service.delete<typeof mockResponse>(endpoint);

    const req = httpMock.expectOne(`${configService.apiUrl}${endpoint}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);

    const response = await promise;
    expect(response).toEqual(mockResponse);
  });

  it('should handle endpoint with leading slash', async () => {
    const endpoint = '/test';
    const mockResponse = { data: 'test' };

    const promise = service.get<typeof mockResponse>(endpoint);

    const req = httpMock.expectOne(`${configService.apiUrl}${endpoint}`);
    req.flush(mockResponse);

    await promise;
  });

  it('should handle endpoint without leading slash', async () => {
    const endpoint = 'test';
    const mockResponse = { data: 'test' };

    const promise = service.get<typeof mockResponse>(endpoint);

    const req = httpMock.expectOne(`${configService.apiUrl}/${endpoint}`);
    req.flush(mockResponse);

    await promise;
  });
});
