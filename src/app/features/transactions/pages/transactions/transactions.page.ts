import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'os-transactions-page',
  template: `
    <section class="os-transactions">
      <h1>Transações</h1>
    </section>
  `,
  styles: [
    `
      .os-transactions {
        padding: 16px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsPage {}
