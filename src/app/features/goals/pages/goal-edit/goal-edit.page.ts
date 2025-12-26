import {
  Component,
  computed,
  inject,
  OnInit,
  ChangeDetectionStrategy,
  signal,
  effect,
} from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { GoalsState } from '../../state/goals-state/goals.state';
import { NotificationService } from '@core/services/notification/notification.service';
import { BudgetSelectionService } from '@core/services/budget-selection/budget-selection.service';
import { OsPageComponent } from '@shared/ui-components/organisms/os-page/os-page.component';
import {
  OsPageHeaderComponent,
  type BreadcrumbItem,
} from '@shared/ui-components/organisms/os-page-header/os-page-header.component';
import { GoalFormComponent } from '../../components/goal-form/goal-form.component';
import type { CreateGoalDto } from '../../../../../dtos/goal/create-goal-request-dto';
import type { UpdateGoalDto } from '../../../../../dtos/goal/update-goal-request-dto';

@Component({
  selector: 'os-goal-edit-page',
  imports: [OsPageComponent, OsPageHeaderComponent, GoalFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <os-page variant="default" size="medium" ariaLabel="Editar meta">
      <os-page-header
        [title]="pageTitle()"
        [subtitle]="pageSubtitle()"
        [breadcrumbs]="breadcrumbs()"
        (breadcrumbClick)="onBreadcrumbClick($event)"
      />

      @if (goal()) {
      <os-goal-form
        [initialData]="initialData()"
        [formTitle]="'Editar Meta'"
        [loading]="loading()"
        (save)="onSave($event)"
        (cancelled)="onCancel()"
      />
      } @else {
      <div class="goal-edit-page__error">
        <p>Meta não encontrada</p>
      </div>
      }
    </os-page>
  `,
  styleUrl: './goal-edit.page.scss',
})
export class GoalEditPage implements OnInit {
  private readonly goalsState = inject(GoalsState);
  private readonly notificationService = inject(NotificationService);
  private readonly budgetSelection = inject(BudgetSelectionService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly loading = computed(() => this.goalsState.isLoading());

  private readonly _goalId = signal<string | null>(null);

  readonly goal = computed(() => {
    const id = this._goalId();
    if (!id) return null;

    const goals = this.goalsState.items();
    return goals.find((g) => g.id === id) || null;
  });

  readonly pageTitle = computed(() => {
    const goal = this.goal();
    return goal ? `Editar ${goal.name}` : 'Editar Meta';
  });

  readonly pageSubtitle = computed(() => 'Atualize as informações da meta');

  readonly breadcrumbs = computed((): BreadcrumbItem[] => {
    const goal = this.goal();
    const base: BreadcrumbItem[] = [{ label: 'Metas', route: '/goals' }];
    if (goal) {
      base.push({ label: goal.name, route: `/goals/${goal.id}` });
    }
    base.push({ label: 'Editar', route: undefined });
    return base;
  });

  readonly initialData = computed<Partial<CreateGoalDto> | null>(() => {
    const goal = this.goal();
    if (!goal) return null;

    return {
      name: goal.name,
      totalAmount: goal.totalAmount,
      deadline: goal.deadline ?? undefined,
      sourceAccountId: goal.sourceAccountId,
    };
  });

  constructor() {
    effect(() => {
      const budgetId = this.budgetSelection.selectedBudgetId();
      if (budgetId && this.goalsState.items().length === 0) {
        this.goalsState.load(budgetId);
      }
    });
  }

  ngOnInit(): void {
    const goalId = this.route.snapshot.paramMap.get('id');
    if (!goalId) {
      this.notificationService.showError('ID da meta não encontrado');
      this.navigateBack();
      return;
    }

    this._goalId.set(goalId);

    const budgetId = this.budgetSelection.selectedBudgetId();
    if (budgetId && this.goalsState.items().length === 0) {
      this.goalsState.load(budgetId);
    }

    const goal = this.goal();
    if (!goal) {
      this.notificationService.showError('Meta não encontrada');
      this.navigateBack();
      return;
    }
  }

  onSave(dto: CreateGoalDto): void {
    const goalId = this._goalId();
    if (!goalId) {
      this.notificationService.showError('ID da meta não encontrado');
      return;
    }

    const deadlineValue = dto.deadline;
    const deadlineString = deadlineValue
      ? typeof deadlineValue === 'string'
        ? deadlineValue
        : new Date(deadlineValue).toISOString().split('T')[0]
      : undefined;

    const updateDto: UpdateGoalDto = {
      id: goalId,
      name: dto.name,
      totalAmount: dto.totalAmount,
      deadline: deadlineString,
    };

    this.goalsState.update(updateDto);
    this.navigateBack();
  }

  onCancel(): void {
    this.navigateBack();
  }

  onBreadcrumbClick(breadcrumb: BreadcrumbItem): void {
    if (breadcrumb.route) {
      this.router.navigate([breadcrumb.route]);
    }
  }

  private navigateBack(): void {
    const goalId = this._goalId();
    if (goalId) {
      this.router.navigate(['/goals', goalId], { replaceUrl: true });
    } else {
      this.router.navigate(['/goals'], { replaceUrl: true });
    }
  }
}
