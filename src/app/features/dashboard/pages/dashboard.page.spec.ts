import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPage } from './dashboard.page';
import { provideZonelessChangeDetection } from '@angular/core';

describe('DashboardPage', () => {
  let component: DashboardPage;
  let fixture: ComponentFixture<DashboardPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DashboardPage],
      providers: [provideZonelessChangeDetection()],
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
