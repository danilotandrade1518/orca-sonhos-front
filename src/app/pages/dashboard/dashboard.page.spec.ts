import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { DashboardPage } from './dashboard.page';

describe('DashboardPage', () => {
  it('should create and compute total balance label in BRL', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DashboardPage],
      providers: [provideZonelessChangeDetection()],
    }).createComponent(DashboardPage);
    const comp = fixture.componentInstance;
    comp['overview'].set({ totalBalance: 1234.56 });
    fixture.detectChanges();
    expect(comp.totalBalanceLabel()).toContain('R$');
  });

  it('should compute sync labels', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DashboardPage],
      providers: [provideZonelessChangeDetection()],
    }).createComponent(DashboardPage);
    const comp = fixture.componentInstance;
    comp['syncState'].set('syncing');
    expect(comp.syncLabel()).toContain('Sincronizando');
    comp['syncState'].set('error');
    expect(comp.syncLabel()).toContain('Erro');
    comp['syncState'].set('ok');
    expect(comp.syncLabel()).toContain('Atualizado');
  });
});
