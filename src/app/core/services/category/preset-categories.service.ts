import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import type { CategoryType, CategoryKind } from '../../../../dtos/category/category-types';
import type { CreateCategoryRequestDto } from '../../../../dtos/category/create-category-request-dto';
import { CategoriesApiService } from './categories-api.service';

interface PresetCategoryDefinition {
  name: string;
  type: CategoryType;
  description?: string;
  color?: string;
  icon?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PresetCategoriesService {
  private readonly categoriesApi = inject(CategoriesApiService);

  private readonly presetCatalog: PresetCategoryDefinition[] = [
    {
      name: 'Salário',
      type: 'INCOME',
      description: 'Renda mensal fixa',
    },
    {
      name: 'Freelance',
      type: 'INCOME',
      description: 'Trabalhos autônomos',
    },
    {
      name: 'Investimentos',
      type: 'INCOME',
      description: 'Rendimentos de investimentos',
    },
    {
      name: 'Bônus',
      type: 'INCOME',
      description: 'Bônus e gratificações',
    },
    {
      name: 'Supermercado',
      type: 'EXPENSE',
      description: 'Compras de supermercado',
    },
    {
      name: 'Contas',
      type: 'EXPENSE',
      description: 'Contas de água, luz, internet, etc.',
    },
    {
      name: 'Transporte',
      type: 'EXPENSE',
      description: 'Transporte e deslocamento',
    },
    {
      name: 'Saúde',
      type: 'EXPENSE',
      description: 'Gastos com saúde',
    },
    {
      name: 'Educação',
      type: 'EXPENSE',
      description: 'Gastos com educação',
    },
    {
      name: 'Entretenimento',
      type: 'EXPENSE',
      description: 'Lazer e entretenimento',
    },
    {
      name: 'Roupas',
      type: 'EXPENSE',
      description: 'Vestuário e acessórios',
    },
    {
      name: 'Casa',
      type: 'EXPENSE',
      description: 'Manutenção e melhorias do lar',
    },
    {
      name: 'Transferência',
      type: 'TRANSFER',
      description: 'Transferências entre contas',
    },
    {
      name: 'Poupança',
      type: 'TRANSFER',
      description: 'Aplicações e poupança',
    },
  ];

  getPresetCategories(): PresetCategoryDefinition[] {
    return [...this.presetCatalog];
  }

  getPresetCategoriesByType(type: CategoryType): PresetCategoryDefinition[] {
    return this.presetCatalog.filter((category) => category.type === type);
  }

  async seedPresetCategories(
    userId: string,
    budgetId: string
  ): Promise<{ success: boolean; created: number; errors: string[] }> {
    const presetCategories = this.getPresetCategories();
    const results: { success: boolean; created: number; errors: string[] } = {
      success: true,
      created: 0,
      errors: [],
    };

    for (let index = 0; index < presetCategories.length; index++) {
      const preset = presetCategories[index];
      const dto: CreateCategoryRequestDto = {
        userId,
        budgetId,
        name: preset.name,
        type: preset.type,
        kind: 'PRESET' as CategoryKind,
        description: preset.description,
        color: preset.color,
        icon: preset.icon,
        order: index,
      };

      try {
        const categoryId = await firstValueFrom(this.categoriesApi.createCategory(dto));
        if (categoryId) {
          results.created++;
        } else {
          results.success = false;
          results.errors.push(`Falha ao criar categoria: ${preset.name}`);
        }
      } catch (error) {
        results.success = false;
        const errorMessage =
          error instanceof Error ? error.message : `Erro desconhecido ao criar ${preset.name}`;
        results.errors.push(errorMessage);
      }
    }

    return results;
  }
}
