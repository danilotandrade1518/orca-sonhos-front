import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GoalFormComponent } from '../../components/goal-form/goal-form.component';
import { GoalsState } from '../../state/goals-state/goals.state';
import type { CreateGoalDto } from '../../../../../dtos/goal/create-goal-request-dto';
import { OsPageComponent } from '@shared/ui-components/organisms/os-page/os-page.component';
import {
  OsPageHeaderComponent,
  type BreadcrumbItem,
} from '@shared/ui-components/organisms/os-page-header/os-page-header.component';

@Component({
  selector: 'os-goals-new-page',
  imports: [GoalFormComponent, OsPageComponent, OsPageHeaderComponent],
  template: `
    <os-page variant="default" size="medium" ariaLabel="Nova meta">
      <os-page-header
        title="Nova Meta"
        subtitle="Crie uma nova meta financeira"
        [breadcrumbs]="breadcrumbs()"
        (breadcrumbClick)="onBreadcrumbClick($event)"
      />
      <os-goal-form
        [formTitle]="'Nova Meta'"
        [loading]="state.isLoading()"
        (save)="onSave($event)"
        (cancelled)="onCancel()"
      />
    </os-page>
  `,
  styleUrl: './goals-new.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoalsNewPage {
  readonly state = inject(GoalsState);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly breadcrumbs = computed((): BreadcrumbItem[] => [
    { label: 'Metas', route: '/goals' },
    { label: 'Nova Meta', route: undefined },
  ]);

  onSave(dto: CreateGoalDto): void {
    this.state.create(dto);
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onCancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onBreadcrumbClick(breadcrumb: BreadcrumbItem): void {
    if (breadcrumb.route) {
      this.router.navigate([breadcrumb.route]);
    }
  }
}
