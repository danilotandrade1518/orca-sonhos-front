import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CreateCategoryRequestDto,
  UpdateCategoryRequestDto,
  CategoryResponseDto,
  CategoryListResponseDto,
} from '../../dtos/category';

@Injectable({
  providedIn: 'root',
})
export class CategoryApiService {
  private readonly http = inject(HttpClient);

  // Commands (POST endpoints)
  createCategory(request: CreateCategoryRequestDto): Observable<CategoryResponseDto> {
    return this.http.post<CategoryResponseDto>('/category/create-category', request);
  }

  updateCategory(request: UpdateCategoryRequestDto): Observable<CategoryResponseDto> {
    return this.http.post<CategoryResponseDto>('/category/update-category', request);
  }

  // Queries (GET endpoints)
  getCategory(categoryId: string): Observable<CategoryResponseDto> {
    return this.http.get<CategoryResponseDto>(`/category/${categoryId}`);
  }

  listCategories(userId: string): Observable<CategoryListResponseDto> {
    return this.http.get<CategoryListResponseDto>(`/category/list-categories?userId=${userId}`);
  }
}
