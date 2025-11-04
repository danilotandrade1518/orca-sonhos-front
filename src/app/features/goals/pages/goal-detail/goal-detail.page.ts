import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'os-goal-detail-page',
  imports: [CommonModule],
  template: `
    <div class="os-goal-detail-page">
      <h1>Detalhe da Meta</h1>
      <p>Página de detalhe da meta (placeholder)</p>
    </div>
  `,
  styleUrl: './goal-detail.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoalDetailPage {}

