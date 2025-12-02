import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { beforeEach, describe, expect, it } from 'vitest';

import {
  FinancialHealthIndicatorComponent,
  FinancialHealthIndicators,
} from './financial-health-indicator.component';

describe('FinancialHealthIndicatorComponent', () => {
  let component: FinancialHealthIndicatorComponent;
  let fixture: ComponentFixture<FinancialHealthIndicatorComponent>;

  const mockHealthyIndicators: FinancialHealthIndicators = {
    budgetUsage: {
      value: 65,
      percentage: 65,
      status: 'healthy',
      label: 'Uso de Orçamento',
      description: '65.0% das receitas foram utilizadas',
    },
    cashFlow: {
      value: 115,
      ratio: 115,
      absoluteValue: 2000,
      status: 'healthy',
      label: 'Fluxo de Caixa',
      description: 'Superávit de R$ 2.000,00',
    },
    goalsOnTrack: {
      value: 80,
      percentage: 80,
      status: 'healthy',
      label: 'Metas On-Track',
      description: '4 de 5 metas no prazo',
      onTrackCount: 4,
      totalActiveCount: 5,
    },
    emergencyReserve: {
      value: 6.5,
      monthsCovered: 6.5,
      status: 'healthy',
      label: 'Reserva de Emergência',
      description: '6.5 meses de despesas cobertos',
    },
  };

  const mockWarningIndicators: FinancialHealthIndicators = {
    budgetUsage: {
      value: 85,
      percentage: 85,
      status: 'warning',
      label: 'Uso de Orçamento',
      description: '85.0% das receitas foram utilizadas',
    },
    cashFlow: {
      value: 105,
      ratio: 105,
      absoluteValue: 500,
      status: 'warning',
      label: 'Fluxo de Caixa',
      description: 'Superávit de R$ 500,00',
    },
    goalsOnTrack: {
      value: 60,
      percentage: 60,
      status: 'warning',
      label: 'Metas On-Track',
      description: '3 de 5 metas no prazo',
      onTrackCount: 3,
      totalActiveCount: 5,
    },
    emergencyReserve: {
      value: 4.5,
      monthsCovered: 4.5,
      status: 'warning',
      label: 'Reserva de Emergência',
      description: '4.5 meses de despesas cobertos',
    },
  };

  const mockCriticalIndicators: FinancialHealthIndicators = {
    budgetUsage: {
      value: 110,
      percentage: 110,
      status: 'critical',
      label: 'Uso de Orçamento',
      description: '110.0% das receitas foram utilizadas',
    },
    cashFlow: {
      value: 90,
      ratio: 90,
      absoluteValue: -1000,
      status: 'critical',
      label: 'Fluxo de Caixa',
      description: 'Déficit de R$ 1.000,00',
    },
    goalsOnTrack: {
      value: 40,
      percentage: 40,
      status: 'critical',
      label: 'Metas On-Track',
      description: '2 de 5 metas no prazo',
      onTrackCount: 2,
      totalActiveCount: 5,
    },
    emergencyReserve: {
      value: 2.5,
      monthsCovered: 2.5,
      status: 'critical',
      label: 'Reserva de Emergência',
      description: '2.5 meses de despesas cobertos',
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancialHealthIndicatorComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialHealthIndicatorComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Empty State', () => {
    it('should display empty state when no indicators', () => {
      fixture.componentRef.setInput('indicators', {
        budgetUsage: null,
        cashFlow: null,
        goalsOnTrack: null,
        emergencyReserve: null,
      });
      fixture.detectChanges();

      expect(component.hasNoIndicators()).toBe(true);
      const emptyElement = fixture.nativeElement.querySelector(
        '.financial-health-indicator__empty'
      );
      expect(emptyElement).toBeTruthy();
    });
  });

  describe('Healthy Indicators', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('indicators', mockHealthyIndicators);
      fixture.detectChanges();
    });

    it('should render all 4 indicators', () => {
      const cards = fixture.nativeElement.querySelectorAll('.financial-health-indicator__card');
      expect(cards.length).toBe(4);
    });

    it('should apply healthy status class to cards', () => {
      const cards = fixture.nativeElement.querySelectorAll(
        '.financial-health-indicator__card--healthy'
      );
      expect(cards.length).toBe(4);
    });

    it('should display budget usage indicator', () => {
      const budgetCard = fixture.nativeElement.querySelector('.financial-health-indicator__card');
      expect(budgetCard).toBeTruthy();
      expect(budgetCard.textContent).toContain('Uso de Orçamento');
      expect(budgetCard.textContent).toContain('65.0%');
    });

    it('should display cash flow indicator', () => {
      const cards = fixture.nativeElement.querySelectorAll('.financial-health-indicator__card');
      expect(cards[1].textContent).toContain('Fluxo de Caixa');
      expect(cards[1].textContent).toContain('115.0%');
    });

    it('should display goals on track indicator', () => {
      const cards = fixture.nativeElement.querySelectorAll('.financial-health-indicator__card');
      expect(cards[2].textContent).toContain('Metas On-Track');
      expect(cards[2].textContent).toContain('80.0%');
      expect(cards[2].textContent).toContain('4 / 5');
    });

    it('should display emergency reserve indicator', () => {
      const cards = fixture.nativeElement.querySelectorAll('.financial-health-indicator__card');
      expect(cards[3].textContent).toContain('Reserva de Emergência');
      expect(cards[3].textContent).toContain('6.5');
      expect(cards[3].textContent).toContain('meses');
    });
  });

  describe('Warning Indicators', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('indicators', mockWarningIndicators);
      fixture.detectChanges();
    });

    it('should apply warning status class to cards', () => {
      const cards = fixture.nativeElement.querySelectorAll(
        '.financial-health-indicator__card--warning'
      );
      expect(cards.length).toBe(4);
    });

    it('should display warning badge text', () => {
      const badges = fixture.nativeElement.querySelectorAll('os-badge');
      
      const statusBadges = Array.from(badges).filter((badge) => {
        const text = (badge as HTMLElement).textContent?.trim();
        return text === 'Atenção';
      });
      
      expect(statusBadges.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Critical Indicators', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('indicators', mockCriticalIndicators);
      fixture.detectChanges();
    });

    it('should apply critical status class to cards', () => {
      const cards = fixture.nativeElement.querySelectorAll(
        '.financial-health-indicator__card--critical'
      );
      expect(cards.length).toBe(4);
    });

    it('should display critical badge text', () => {
      const badges = fixture.nativeElement.querySelectorAll('os-badge');
      
      const statusBadges = Array.from(badges).filter((badge) => {
        const text = (badge as HTMLElement).textContent?.trim();
        return text === 'Crítico';
      });
      
      expect(statusBadges.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Status Helpers', () => {
    it('should return correct icon for healthy status', () => {
      expect(component.getStatusIcon('healthy')).toBe('check-circle');
    });

    it('should return correct icon for warning status', () => {
      expect(component.getStatusIcon('warning')).toBe('warning');
    });

    it('should return correct icon for critical status', () => {
      expect(component.getStatusIcon('critical')).toBe('error');
    });

    it('should return correct cash flow icon for healthy status', () => {
      expect(component.getCashFlowIcon('healthy')).toBe('trending-up');
    });

    it('should return correct cash flow icon for warning status', () => {
      expect(component.getCashFlowIcon('warning')).toBe('trending-flat');
    });

    it('should return correct cash flow icon for critical status', () => {
      expect(component.getCashFlowIcon('critical')).toBe('trending-down');
    });

    it('should return correct status label', () => {
      expect(component.getStatusLabel('healthy')).toBe('Saudável');
      expect(component.getStatusLabel('warning')).toBe('Atenção');
      expect(component.getStatusLabel('critical')).toBe('Crítico');
    });

    it('should return correct badge variant', () => {
      expect(component.getBadgeVariant('healthy')).toBe('success');
      expect(component.getBadgeVariant('warning')).toBe('warning');
      expect(component.getBadgeVariant('critical')).toBe('error');
    });

    it('should return correct progress variant', () => {
      expect(component.getProgressVariant('healthy')).toBe('success');
      expect(component.getProgressVariant('warning')).toBe('warning');
      expect(component.getProgressVariant('critical')).toBe('danger');
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('indicators', mockHealthyIndicators);
      fixture.detectChanges();
    });

    it('should have proper ARIA region role', () => {
      const region = fixture.nativeElement.querySelector('[role="region"]');
      expect(region).toBeTruthy();
      expect(region.getAttribute('aria-labelledby')).toBe('financial-health-title');
    });

    it('should have proper heading structure', () => {
      const title = fixture.nativeElement.querySelector('#financial-health-title');
      expect(title).toBeTruthy();
      expect(title.textContent).toContain('Saúde Financeira');
    });

    it('should have status badges with proper ARIA labels', () => {
      const badges = fixture.nativeElement.querySelectorAll('os-badge');
      expect(badges.length).toBeGreaterThan(0);
      
      badges.forEach((badge: Element) => {
        const badgeElement = badge as HTMLElement;
        expect(badgeElement).toBeTruthy();
        
        const hasContent = badgeElement.textContent?.trim() || badgeElement.getAttribute('aria-label');
        expect(hasContent).toBeTruthy();
      });
    });
  });

  describe('Partial Indicators', () => {
    it('should render only available indicators', () => {
      fixture.componentRef.setInput('indicators', {
        budgetUsage: mockHealthyIndicators.budgetUsage,
        cashFlow: null,
        goalsOnTrack: mockHealthyIndicators.goalsOnTrack,
        emergencyReserve: null,
      });
      fixture.detectChanges();

      const cards = fixture.nativeElement.querySelectorAll('.financial-health-indicator__card');
      expect(cards.length).toBe(2);
    });
  });
});
