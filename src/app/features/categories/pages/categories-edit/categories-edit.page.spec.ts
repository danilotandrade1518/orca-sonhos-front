import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { signal, computed } from '@angular/core';
import { CategoriesEditPage } from './categories-edit.page';
import { CategoryState } from '@core/services/category/category.state';
import { BudgetSelectionService } from '@core/services/budget-selection/budget-selection.service';
import { AuthService } from '@core/services/auth/auth.service';
import { NotificationService } from '@core/services/notification/notification.service';
import type { CategoryDto } from '../../../../../dtos/category/category-types';

describe('CategoriesEditPage', () => {
  let component: CategoriesEditPage;
  let fixture: ComponentFixture<CategoriesEditPage>;
  let categoryState: {
    categoriesByBudgetId: ReturnType<typeof computed<CategoryDto[]>>;
    loading: ReturnType<typeof signal<boolean>>;
    getCategoryById: ReturnType<typeof vi.fn>;
    updateCategory: ReturnType<typeof vi.fn>;
    loadCategories: ReturnType<typeof vi.fn>;
  };
  let budgetSelection: {
    selectedBudgetId: ReturnType<typeof signal<string | null>>;
  };
  let authService: {
    currentUser: ReturnType<typeof signal<{ id: string; email: string; name: string } | null>>;
  };
  let router: Router;
  let notificationService: {
    showSuccess: ReturnType<typeof vi.fn>;
    showError: ReturnType<typeof vi.fn>;
  };
  let activatedRoute: ActivatedRoute;

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
  };

  const mockBudgetId = 'budget-1';

  const mockCategory: CategoryDto = {
    id: 'category-1',
    budgetId: mockBudgetId,
    name: 'Test Category',
    description: 'Test Description',
    type: 'EXPENSE',
    kind: 'CUSTOM',
    color: '#3B82F6',
    icon: 'folder',
    active: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    order: 0,
  };

  beforeEach(() => {
    const categoriesSignal = signal<CategoryDto[]>([mockCategory]);
    categoryState = {
      categoriesByBudgetId: computed(() => categoriesSignal()),
      loading: signal(false),
      getCategoryById: vi.fn((id: string) => {
        return categoriesSignal().find((c) => c.id === id);
      }),
      updateCategory: vi.fn(),
      loadCategories: vi.fn(),
    };

    budgetSelection = {
      selectedBudgetId: signal(mockBudgetId),
    };

    authService = {
      currentUser: signal(mockUser),
    };

    router = {
      navigate: vi.fn(),
    } as unknown as Router;

    notificationService = {
      showSuccess: vi.fn(),
      showError: vi.fn(),
    };

    const paramMap = new Map();
    paramMap.set('id', 'category-1');

    activatedRoute = {
      snapshot: {
        paramMap: paramMap,
      },
    } as unknown as ActivatedRoute;

    TestBed.configureTestingModule({
      imports: [CategoriesEditPage],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        {
          provide: CategoryState,
          useValue: categoryState,
        },
        {
          provide: BudgetSelectionService,
          useValue: budgetSelection,
        },
        {
          provide: AuthService,
          useValue: authService,
        },
        {
          provide: Router,
          useValue: router,
        },
        {
          provide: ActivatedRoute,
          useValue: activatedRoute,
        },
        {
          provide: NotificationService,
          useValue: notificationService,
        },
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriesEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('Initialization', () => {
    it('should initialize form with category data', () => {
      component.ngOnInit();
      fixture.detectChanges();

      const form = component.form();
      expect(form).toBeTruthy();
      expect(form?.get('name')?.value).toBe(mockCategory.name);
      expect(form?.get('description')?.value).toBe(mockCategory.description);
      expect(form?.get('type')?.value).toBe(mockCategory.type);
    });

    it('should show error when category ID is not found', () => {
      const paramMap = new Map();
      activatedRoute.snapshot.paramMap = paramMap;

      component.ngOnInit();
      fixture.detectChanges();

      expect(notificationService.showError).toHaveBeenCalledWith('ID da categoria não encontrado');
      expect(router.navigate).toHaveBeenCalledWith(['/categories'], { replaceUrl: true });
    });

    it('should show error when budget is not selected', () => {
      budgetSelection.selectedBudgetId.set(null);
      fixture.detectChanges();

      component.ngOnInit();
      fixture.detectChanges();

      expect(notificationService.showError).toHaveBeenCalledWith('Nenhum orçamento selecionado');
      expect(router.navigate).toHaveBeenCalledWith(['/categories'], { replaceUrl: true });
    });

    it('should show error when category is not found', () => {
      categoryState.getCategoryById.mockReturnValue(undefined);

      component.ngOnInit();
      fixture.detectChanges();

      expect(notificationService.showError).toHaveBeenCalledWith('Categoria não encontrada');
      expect(router.navigate).toHaveBeenCalledWith(['/categories'], { replaceUrl: true });
    });

    it('should load categories if list is empty', () => {
      categoryState.categoriesByBudgetId = computed(() => []);
      categoryState.loadCategories.mockImplementation(() => {
        categoryState.categoriesByBudgetId = computed(() => [mockCategory]);
      });

      component.ngOnInit();
      fixture.detectChanges();

      expect(categoryState.loadCategories).toHaveBeenCalledWith(true);
    });
  });

  describe('Computed Properties', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should return correct page title', () => {
      expect(component.pageTitle()).toBe(`Editar ${mockCategory.name}`);
    });

    it('should return correct page subtitle', () => {
      expect(component.pageSubtitle()).toBe('Atualize as informações da categoria');
    });

    it('should return correct breadcrumbs', () => {
      const breadcrumbs = component.breadcrumbs();
      expect(breadcrumbs.length).toBe(3);
      expect(breadcrumbs[0].label).toBe('Categorias');
      expect(breadcrumbs[0].route).toBe('/categories');
      expect(breadcrumbs[1].label).toBe(mockCategory.name);
      expect(breadcrumbs[1].route).toBeUndefined();
      expect(breadcrumbs[2].label).toBe('Editar');
      expect(breadcrumbs[2].route).toBeUndefined();
    });

    it('should return correct type options', () => {
      const options = component.typeOptions();
      expect(options.length).toBe(3);
      expect(options[0].value).toBe('EXPENSE');
      expect(options[0].label).toBe('Despesa');
      expect(options[1].value).toBe('INCOME');
      expect(options[1].label).toBe('Receita');
      expect(options[2].value).toBe('TRANSFER');
      expect(options[2].label).toBe('Transferência');
    });

    it('should return correct form config', () => {
      const config = component.formConfig();
      expect(config.showHeader).toBe(false);
      expect(config.showActions).toBe(true);
      expect(config.showSaveButton).toBe(true);
      expect(config.showCancelButton).toBe(true);
      expect(config.saveButtonText).toBe('Salvar');
      expect(config.cancelButtonText).toBe('Cancelar');
    });

    it('should return loading state from categoryState', () => {
      categoryState.loading.set(true);
      fixture.detectChanges();
      expect(component.loading()).toBe(true);

      categoryState.loading.set(false);
      fixture.detectChanges();
      expect(component.loading()).toBe(false);
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should show error when name is empty', () => {
      const form = component.form();
      const nameControl = form?.get('name');
      nameControl?.markAsTouched();
      nameControl?.setValue('');

      component.onSave();
      fixture.detectChanges();

      expect(component.getNameErrorMessage()).toBe('Nome da categoria é obrigatório');
    });

    it('should show error when name is too short', () => {
      const form = component.form();
      const nameControl = form?.get('name');
      nameControl?.markAsTouched();
      nameControl?.setValue('a');

      component.onSave();
      fixture.detectChanges();

      expect(component.getNameErrorMessage()).toBe('Nome deve ter pelo menos 2 caracteres');
    });

    it('should show error when name is too long', () => {
      const form = component.form();
      const nameControl = form?.get('name');
      nameControl?.markAsTouched();
      nameControl?.setValue('a'.repeat(101));

      component.onSave();
      fixture.detectChanges();

      expect(component.getNameErrorMessage()).toBe('Nome deve ter no máximo 100 caracteres');
    });

    it('should show error when description is too long', () => {
      const form = component.form();
      const descriptionControl = form?.get('description');
      descriptionControl?.markAsTouched();
      descriptionControl?.setValue('a'.repeat(501));

      component.onSave();
      fixture.detectChanges();

      expect(component.getDescriptionErrorMessage()).toBe(
        'Descrição deve ter no máximo 500 caracteres'
      );
    });

    it('should show error when type is not selected', () => {
      const form = component.form();
      const typeControl = form?.get('type');
      typeControl?.markAsTouched();
      typeControl?.setValue(null);

      component.onSave();
      fixture.detectChanges();

      expect(component.getTypeErrorMessage()).toBe('Tipo da categoria é obrigatório');
    });
  });

  describe('onSave', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should not save when form is invalid', () => {
      const form = component.form();
      form?.get('name')?.setValue('');

      component.onSave();
      fixture.detectChanges();

      expect(categoryState.updateCategory).not.toHaveBeenCalled();
      expect(notificationService.showSuccess).not.toHaveBeenCalled();
    });

    it('should mark form as touched when invalid', () => {
      const form = component.form();
      form?.get('name')?.setValue('');

      component.onSave();
      fixture.detectChanges();

      expect(form?.touched).toBe(true);
    });

    it('should update category when form is valid', () => {
      const form = component.form();
      form?.patchValue({
        name: 'Categoria Atualizada',
        description: 'Nova descrição',
        type: 'INCOME',
      });

      component.onSave();
      fixture.detectChanges();

      expect(categoryState.updateCategory).toHaveBeenCalledWith({
        id: mockCategory.id,
        userId: mockUser.id,
        name: 'Categoria Atualizada',
        type: 'INCOME',
        description: 'Nova descrição',
      });
      expect(notificationService.showSuccess).toHaveBeenCalledWith(
        'Categoria atualizada com sucesso!'
      );
      expect(router.navigate).toHaveBeenCalledWith(['/categories'], { replaceUrl: true });
    });

    it('should update category without description when description is empty', () => {
      const form = component.form();
      form?.patchValue({
        name: 'Categoria Atualizada',
        description: '',
        type: 'EXPENSE',
      });

      component.onSave();
      fixture.detectChanges();

      expect(categoryState.updateCategory).toHaveBeenCalledWith({
        id: mockCategory.id,
        userId: mockUser.id,
        name: 'Categoria Atualizada',
        type: 'EXPENSE',
        description: undefined,
      });
    });

    it('should show error when user is not authenticated', () => {
      authService.currentUser.set(null);
      fixture.detectChanges();

      const form = component.form();
      form?.patchValue({
        name: 'Categoria Atualizada',
        type: 'EXPENSE',
      });

      component.onSave();
      fixture.detectChanges();

      expect(categoryState.updateCategory).not.toHaveBeenCalled();
      expect(notificationService.showError).toHaveBeenCalledWith(
        'Dados insuficientes para atualizar a categoria'
      );
    });

    it('should show error when category ID is missing', () => {
      component['_categoryId'].set(null);
      fixture.detectChanges();

      const form = component.form();
      form?.patchValue({
        name: 'Categoria Atualizada',
        type: 'EXPENSE',
      });

      component.onSave();
      fixture.detectChanges();

      expect(categoryState.updateCategory).not.toHaveBeenCalled();
      expect(notificationService.showError).toHaveBeenCalledWith(
        'Dados insuficientes para atualizar a categoria'
      );
    });
  });

  describe('onCancel', () => {
    it('should navigate back to categories list', () => {
      component.onCancel();
      expect(router.navigate).toHaveBeenCalledWith(['/categories'], { replaceUrl: true });
    });
  });

  describe('onBreadcrumbClick', () => {
    it('should navigate when breadcrumb has route', () => {
      component.onBreadcrumbClick({ label: 'Categorias', route: '/categories' });
      expect(router.navigate).toHaveBeenCalledWith(['/categories']);
    });

    it('should not navigate when breadcrumb has no route', () => {
      component.onBreadcrumbClick({ label: 'Editar', route: undefined });
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  describe('Loading State', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should disable form when loading', () => {
      categoryState.loading.set(true);
      fixture.detectChanges();

      const form = component.form();
      expect(form?.disabled).toBe(true);
    });

    it('should enable form when not loading', () => {
      categoryState.loading.set(false);
      fixture.detectChanges();

      const form = component.form();
      expect(form?.disabled).toBe(false);
    });
  });
});
