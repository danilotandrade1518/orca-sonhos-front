import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { signal } from '@angular/core';

import { DashboardPage } from './dashboard.page';
import { EXTERNAL_AUTH_SERVICE_ADAPTER } from '../../../../core/adapters/external-auth-service.adapter';

describe('DashboardPage', () => {
  let component: DashboardPage;
  let fixture: ComponentFixture<DashboardPage>;

  beforeEach(() => {
    const mockAuthAdapter = {
      user: signal(null),
      isAuthenticated: signal(false),
      isLoading: signal(false),
      error: signal(null),
      login: () => Promise.resolve(),
      logout: () => Promise.resolve(),
      getAccessToken: () => Promise.resolve(null),
      initializeAuthState: (callback: (user: any) => void) => {
        callback(null);
      },
    };

    TestBed.configureTestingModule({
      imports: [DashboardPage],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: new Map(),
              queryParamMap: new Map(),
            },
          },
        },
        {
          provide: EXTERNAL_AUTH_SERVICE_ADAPTER,
          useValue: mockAuthAdapter,
        },
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
