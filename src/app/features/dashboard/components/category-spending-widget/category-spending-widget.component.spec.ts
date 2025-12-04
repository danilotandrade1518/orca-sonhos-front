import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CategorySpendingWidgetComponent } from './category-spending-widget.component';
import { CategorySpendingDto } from '../../../../../dtos/report/category-spending.dto';
import { LocaleService } from '@shared/formatting';

describe('CategorySpendingWidgetComponent', () => {
  let component: CategorySpendingWidgetComponent;
  let fixture: ComponentFixture<CategorySpendingWidgetComponent>;
  let localeService: LocaleService;

  const mockCategories: CategorySpendingDto[] = [
    {
      categoryId: 'cat-1',
      categoryName: 'Alimentação',
      totalAmount: 1500,
      percentage: 50,
      transactionCount: 15,
    },
    {
      categoryId: 'cat-2',
      categoryName: 'Transporte',
      totalAmount: 600,
      percentage: 20,
      transactionCount: 8,
    },
    {
      categoryId: 'cat-3',
      categoryName: 'Lazer',
      totalAmount: 300,
      percentage: 10,
      transactionCount: 5,
    },
    {
      categoryId: 'cat-4',
      categoryName: 'Saúde',
      totalAmount: 600,
      percentage: 20,
      transactionCount: 3,
    },
  ];

  beforeEach(async () => {
    localeService = {
      formatCurrency: vi.fn((value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`),
    } as unknown as LocaleService;

    const mockActivatedRoute = {
      snapshot: {
        data: {},
        paramMap: {
          get: vi.fn(() => null),
        },
      },
    };

    await TestBed.configureTestingModule({
      imports: [CategorySpendingWidgetComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: LocaleService, useValue: localeService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategorySpendingWidgetComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initial State', () => {
    it('should initialize with empty categories', () => {
      expect(component.categories()).toEqual([]);
      expect(component.isEmpty()).toBe(true);
    });

    it('should initialize with loading false', () => {
      expect(component.isLoading()).toBe(false);
    });
  });

  describe('Empty State', () => {
    it('should display empty state when no categories', () => {
      fixture.componentRef.setInput('categories', []);
      fixture.detectChanges();

      const emptyElement = fixture.nativeElement.querySelector('.category-spending-widget__empty');
      expect(emptyElement).toBeTruthy();
    });

    it('should display empty message', () => {
      fixture.componentRef.setInput('categories', []);
      fixture.detectChanges();

      const emptyText = fixture.nativeElement.querySelector('.category-spending-widget__empty-text');
      expect(emptyText?.textContent).toContain('Nenhum gasto por categoria registrado');
    });
  });

  describe('Loading State', () => {
    it('should display loading skeleton when isLoading is true', () => {
      fixture.componentRef.setInput('isLoading', true);
      fixture.detectChanges();

      const loadingElement = fixture.nativeElement.querySelector('.category-spending-widget__loading');
      expect(loadingElement).toBeTruthy();
    });

    it('should display skeleton items', () => {
      fixture.componentRef.setInput('isLoading', true);
      fixture.detectChanges();

      const skeletonItems = fixture.nativeElement.querySelectorAll('.category-spending-widget__skeleton-item');
      expect(skeletonItems.length).toBe(4);
    });
  });

  describe('Categories Display', () => {
    it('should display categories list when categories are provided', () => {
      fixture.componentRef.setInput('categories', mockCategories);
      fixture.detectChanges();

      const listElement = fixture.nativeElement.querySelector('.category-spending-widget__list');
      expect(listElement).toBeTruthy();

      const items = fixture.nativeElement.querySelectorAll('.category-spending-widget__item');
      expect(items.length).toBe(mockCategories.length);
    });

    it('should limit displayed categories to maxDisplayed', () => {
      const manyCategories = Array.from({ length: 10 }, (_, i) => ({
        categoryId: `cat-${i}`,
        categoryName: `Categoria ${i}`,
        totalAmount: 100 * (i + 1),
        percentage: 10,
        transactionCount: i + 1,
      }));

      fixture.componentRef.setInput('categories', manyCategories);
      fixture.componentRef.setInput('maxDisplayed', 5);
      fixture.detectChanges();

      const items = fixture.nativeElement.querySelectorAll('.category-spending-widget__item');
      expect(items.length).toBeLessThanOrEqual(5);
    });

    it('should display category name', () => {
      fixture.componentRef.setInput('categories', [mockCategories[0]]);
      fixture.detectChanges();

      const categoryName = fixture.nativeElement.querySelector('.category-spending-widget__item-name');
      expect(categoryName?.textContent).toContain('Alimentação');
    });

    it('should display category percentage', () => {
      fixture.componentRef.setInput('categories', [mockCategories[0]]);
      fixture.detectChanges();

      const percentage = fixture.nativeElement.querySelector('.category-spending-widget__item-percentage');
      expect(percentage?.textContent).toContain('50.0%');
    });

    it('should display category amount', () => {
      fixture.componentRef.setInput('categories', [mockCategories[0]]);
      fixture.detectChanges();

      const moneyDisplay = fixture.nativeElement.querySelector('os-money-display');
      expect(moneyDisplay).toBeTruthy();
    });

    it('should display transaction count', () => {
      fixture.componentRef.setInput('categories', [mockCategories[0]]);
      fixture.detectChanges();

      const count = fixture.nativeElement.querySelector('.category-spending-widget__item-count');
      expect(count?.textContent).toContain('15 transações');
    });

    it('should display singular form for single transaction', () => {
      const singleTransactionCategory: CategorySpendingDto = {
        categoryId: 'cat-1',
        categoryName: 'Alimentação',
        totalAmount: 100,
        percentage: 10,
        transactionCount: 1,
      };

      fixture.componentRef.setInput('categories', [singleTransactionCategory]);
      fixture.detectChanges();

      const count = fixture.nativeElement.querySelector('.category-spending-widget__item-count');
      expect(count?.textContent).toContain('1 transação');
    });
  });

  describe('Progress Bar', () => {
    it('should display progress bar for each category', () => {
      fixture.componentRef.setInput('categories', mockCategories);
      fixture.detectChanges();

      const progressBars = fixture.nativeElement.querySelectorAll('os-progress-bar');
      expect(progressBars.length).toBe(mockCategories.length);
    });

    it('should set correct progress value', () => {
      fixture.componentRef.setInput('categories', [mockCategories[0]]);
      fixture.detectChanges();

      const progressBar = fixture.nativeElement.querySelector('os-progress-bar');
      expect(progressBar).toBeTruthy();
      
      const progressBarElement = progressBar as HTMLElement;
      expect(progressBarElement).toBeTruthy();
    });
  });

  describe('Progress Variant', () => {
    it('should return error variant for percentage >= 30', () => {
      const variant = component.getProgressVariant(35);
      expect(variant).toBe('danger');
    });

    it('should return warning variant for percentage >= 20', () => {
      const variant = component.getProgressVariant(25);
      expect(variant).toBe('warning');
    });

    it('should return default variant for percentage >= 10', () => {
      const variant = component.getProgressVariant(15);
      expect(variant).toBe('primary');
    });

    it('should return success variant for percentage < 10', () => {
      const variant = component.getProgressVariant(5);
      expect(variant).toBe('success');
    });
  });

  describe('Formatting', () => {
    it('should format percentage correctly', () => {
      const formatted = component.formatPercentage(50.5);
      expect(formatted).toBe('50.5%');
    });

    it('should format currency using LocaleService', () => {
      component.formatCurrency(1500);
      expect(localeService.formatCurrency).toHaveBeenCalledWith(1500, 'BRL');
    });
  });

  describe('Info Message', () => {
    it('should display info message about envelopes', () => {
      fixture.componentRef.setInput('categories', mockCategories);
      fixture.detectChanges();

      const infoElement = fixture.nativeElement.querySelector('.category-spending-widget__info');
      expect(infoElement).toBeTruthy();

      const infoText = fixture.nativeElement.querySelector('.category-spending-widget__info-text');
      expect(infoText?.textContent).toContain('% do planejado');
      expect(infoText?.textContent).toContain('envelopes');
    });
  });

  describe('Accessibility', () => {
    it('should have role="region"', () => {
      fixture.detectChanges();

      const region = fixture.nativeElement.querySelector('[role="region"]');
      expect(region).toBeTruthy();
    });

    it('should have aria-labelledby pointing to title', () => {
      fixture.detectChanges();

      const region = fixture.nativeElement.querySelector('[role="region"]');
      expect(region?.getAttribute('aria-labelledby')).toBe('category-spending-title');
    });

    it('should have proper ARIA labels on progress bars', () => {
      fixture.componentRef.setInput('categories', [mockCategories[0]]);
      fixture.detectChanges();

      const progressBar = fixture.nativeElement.querySelector('os-progress-bar');
      expect(progressBar).toBeTruthy();
      
      const progressBarContainer = progressBar?.querySelector('.os-progress-bar__container');
      expect(progressBarContainer).toBeTruthy();
    });

    it('should have proper ARIA labels on money display', () => {
      fixture.componentRef.setInput('categories', [mockCategories[0]]);
      fixture.detectChanges();

      const moneyDisplay = fixture.nativeElement.querySelector('os-money-display');
      expect(moneyDisplay).toBeTruthy();
      
      const valueElement = moneyDisplay?.querySelector('.os-money-display__value');
      expect(valueElement).toBeTruthy();
    });
  });

  describe('Footer', () => {
    it('should display footer note when hasMoreCategories', () => {
      const manyCategories = Array.from({ length: 10 }, (_, i) => ({
        categoryId: `cat-${i}`,
        categoryName: `Categoria ${i}`,
        totalAmount: 100 * (i + 1),
        percentage: 10,
        transactionCount: i + 1,
      }));

      fixture.componentRef.setInput('categories', manyCategories);
      fixture.componentRef.setInput('maxDisplayed', 5);
      fixture.detectChanges();

      const footer = fixture.nativeElement.querySelector('.category-spending-widget__footer');
      expect(footer).toBeTruthy();

      const footerNote = fixture.nativeElement.querySelector('.category-spending-widget__footer-note');
      expect(footerNote?.textContent).toContain('Mostrando 5 de 10 categorias');
    });

    it('should not display footer when all categories are shown', () => {
      fixture.componentRef.setInput('categories', mockCategories);
      fixture.componentRef.setInput('maxDisplayed', 10);
      fixture.detectChanges();

      const footer = fixture.nativeElement.querySelector('.category-spending-widget__footer');
      expect(footer).toBeFalsy();
    });
  });
});
