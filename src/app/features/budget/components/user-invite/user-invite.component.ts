import {
  Component,
  computed,
  inject,
  signal,
  output,
  input,
  ChangeDetectionStrategy,
  DestroyRef,
  effect,
} from '@angular/core';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

import { SharingService } from '@core/services/sharing/sharing.service';
import { SearchUserResponseDto } from '../../../../../dtos/budget';
import {
  OsSearchBoxComponent,
  type OsSearchSuggestion,
} from '@shared/ui-components/molecules/os-search-box/os-search-box.component';
import { OsButtonComponent } from '@shared/ui-components/atoms/os-button/os-button.component';

@Component({
  selector: 'os-user-invite',
  standalone: true,
  imports: [OsSearchBoxComponent, OsButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="user-invite" [class]="containerClass()">
      <os-search-box
        [value]="searchValue()"
        [placeholder]="'Buscar por email ou telefone'"
        [disabled]="loading() || disabled()"
        [size]="'medium'"
        [showSuggestions]="true"
        [suggestions]="suggestions()"
        [maxSuggestions]="5"
        [debounceTime]="300"
        [role]="'combobox'"
        [ariaLabel]="'Buscar usuário por email ou telefone'"
        [ariaDescribedBy]="ariaDescribedBy() || ''"
        (valueChange)="onSearchValueChange($event)"
        (debouncedSearch)="onDebouncedSearch($event)"
        (suggestionSelect)="onSuggestionSelect($event)"
      />

      @if (error()) {
      <div class="user-invite__error" role="alert" [attr.aria-live]="'assertive'">
        <span class="user-invite__error-text">{{ error() }}</span>
      </div>
      } @if (selectedUser() && !loading()) {
      <div class="user-invite__selected" role="status" [attr.aria-live]="'polite'">
        <div class="user-invite__selected-content">
          <span class="user-invite__selected-label">Usuário selecionado:</span>
          <span class="user-invite__selected-name">{{ selectedUser()?.name }}</span>
          <span class="user-invite__selected-email">{{ selectedUser()?.email }}</span>
        </div>
        <os-button
          variant="tertiary"
          size="small"
          (click)="clearSelection()"
          [attr.aria-label]="'Limpar seleção'"
        >
          Limpar
        </os-button>
      </div>
      } @if (loading() && searchValue().length > 0) {
      <div class="user-invite__loading" role="status" [attr.aria-live]="'polite'">
        <span class="user-invite__loading-text">Buscando usuários...</span>
      </div>
      }
    </div>
  `,
  styleUrl: './user-invite.component.scss',
})
export class UserInviteComponent {
  private readonly sharingService = inject(SharingService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly searchSubject = new Subject<string>();
  private readonly _searchValue = signal<string>('');
  private readonly _selectedUser = signal<SearchUserResponseDto | null>(null);
  private readonly _suggestions = signal<OsSearchSuggestion[]>([]);
  private readonly _foundUsers = signal<SearchUserResponseDto[]>([]);
  private readonly _error = signal<string | null>(null);

  readonly disabled = input<boolean>(false);

  readonly userSelected = output<string | null>();

  readonly searchValue = this._searchValue.asReadonly();
  readonly selectedUser = this._selectedUser.asReadonly();
  readonly suggestions = this._suggestions.asReadonly();
  readonly error = this._error.asReadonly();
  readonly loading = computed(() => this.sharingService.loading());

  readonly containerClass = computed(() => {
    return [
      'user-invite',
      this.loading() ? 'user-invite--loading' : '',
      this.error() ? 'user-invite--error' : '',
      this.selectedUser() ? 'user-invite--selected' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  readonly ariaDescribedBy = computed(() => {
    if (this.error()) return 'user-invite-error';
    if (this.loading()) return 'user-invite-loading';
    return null;
  });

  constructor() {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((query) => {
        this.performSearch(query);
      });

    effect(() => {
      const selectedUser = this._selectedUser();
      this.userSelected.emit(selectedUser?.id || null);
    });
  }

  onSearchValueChange(value: string): void {
    this._searchValue.set(value);
    this._error.set(null);

    if (!value || value.trim().length === 0) {
      this._suggestions.set([]);
      this._selectedUser.set(null);
      return;
    }

    this.searchSubject.next(value);
  }

  onDebouncedSearch(query: string): void {
    if (!query || query.trim().length === 0) {
      this._suggestions.set([]);
      return;
    }
    this.searchSubject.next(query);
  }

  onSuggestionSelect(suggestion: OsSearchSuggestion): void {
    const users = this._foundUsers();
    const user = users.find((u) => u.id === suggestion.id);
    if (user) {
      this._selectedUser.set(user);
      this._searchValue.set(user.name);
      this._suggestions.set([]);
      this._error.set(null);
    }
  }
  
  clearSelection(): void {
    this._selectedUser.set(null);
    this._searchValue.set('');
    this._suggestions.set([]);
    this._foundUsers.set([]);
    this._error.set(null);
  }
  
  getSelectedUserId(): string | null {
    return this._selectedUser()?.id || null;
  }

  private performSearch(query: string): void {
    if (!query || query.trim().length === 0) {
      this._suggestions.set([]);
      this._foundUsers.set([]);
      return;
    }

    this._error.set(null);

    this.sharingService.searchUsers(query).subscribe({
      next: (users) => {
        this._foundUsers.set(users);

        const suggestions: OsSearchSuggestion[] = users.map((user) => ({
          id: user.id,
          text: `${user.name} (${user.email})`,
          highlightedText: this.highlightMatch(user.name, query),
        }));

        this._suggestions.set(suggestions);
      },
      error: (err) => {
        this._error.set(err?.message || 'Erro ao buscar usuários. Tente novamente.');
        this._suggestions.set([]);
        this._foundUsers.set([]);
      },
    });
  }

  private highlightMatch(text: string, query: string): string {
    if (!query || query.trim().length === 0) return text;

    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<strong>$1</strong>');
  }
}
