import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'os-goals-page',
  imports: [CommonModule],
  template: `
    <div class="os-goals-page">
      <h1>Metas</h1>
      <p>Página de listagem de metas (placeholder)</p>
    </div>
  `,
  styleUrl: './goals.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoalsPage {}

