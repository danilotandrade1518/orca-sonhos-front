import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { IEnvelopeQueriesPort } from '@application/ports/envelope/IEnvelopeQueriesPort';
import { Uuid } from '@models/shared/value-objects/Uuid';

import { ENVELOPE_QUERY } from './tokens/envelope.query.token';

@Component({
  selector: 'app-envelopes-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section style="padding:1rem;border:1px solid #ddd;margin-top:1rem">
      <h3>Envelopes</h3>
      <div style="margin-bottom:0.5rem">
        <label
          >BudgetId: <input [value]="budgetId()" (input)="onBudgetId($any($event.target).value)"
        /></label>
      </div>
      <div style="margin-bottom:0.5rem">
        <label
          >UserId: <input [value]="userId()" (input)="onUserId($any($event.target).value)"
        /></label>
      </div>
      <button type="button" (click)="load()" [disabled]="loading()">Carregar</button>
      @if (loading()) {
      <p>Carregando…</p>
      } @else { @if (error()) {
      <p style="color:#b00">Erro: {{ error() }}</p>
      } @else {
      <ul>
        @for (e of items(); track e.id) {
        <li>
          <strong>{{ e.name }}</strong>
          <small> — limite: {{ e.monthlyLimit }}¢, saldo: {{ e.balance }}¢</small>
        </li>
        }
      </ul>
      } }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnvelopesListComponent {
  private readonly query = inject<IEnvelopeQueriesPort>(ENVELOPE_QUERY);

  readonly budgetId = signal<string>('00000000-0000-0000-0000-000000000000');
  readonly userId = signal<string>('00000000-0000-0000-0000-000000000000');
  readonly items = signal<
    Array<{ id: string; name: string; monthlyLimit: number; balance: number }>
  >([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  onBudgetId(v: string) {
    this.budgetId.set(v);
  }
  onUserId(v: string) {
    this.userId.set(v);
  }

  async load() {
    this.loading.set(true);
    this.error.set(null);
    try {
      const result = await this.query.listEnvelopes({
        budgetId: Uuid.create(this.budgetId()),
        userId: Uuid.create(this.userId()),
      });
      this.items.set(result);
    } catch (e) {
      this.error.set(String(e instanceof Error ? e.message : e));
    } finally {
      this.loading.set(false);
    }
  }
}
