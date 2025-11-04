import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'os-goals-new-page',
  imports: [CommonModule],
  template: `
    <div class="os-goals-new-page">
      <h1>Nova Meta</h1>
      <p>Página de criação de meta (placeholder)</p>
    </div>
  `,
  styleUrl: './goals-new.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoalsNewPage {}

