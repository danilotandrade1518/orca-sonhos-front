import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GoalFormComponent } from '../../components/goal-form/goal-form.component';
import { GoalsState } from '../../state/goals-state/goals.state';
import type { CreateGoalDto } from '../../../../../dtos/goal/create-goal-request-dto';

@Component({
  selector: 'os-goals-new-page',
  imports: [CommonModule, GoalFormComponent],
  template: `
    <section class="os-goals-new" role="main" aria-label="Nova meta">
      <os-goal-form
        [formTitle]="'Nova Meta'"
        [loading]="state.isLoading()"
        (save)="onSave($event)"
        (cancelled)="onCancel()"
      />
    </section>
  `,
  styleUrl: './goals-new.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoalsNewPage {
  readonly state = inject(GoalsState);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  onSave(dto: CreateGoalDto): void {
    this.state.create(dto);
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onCancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
