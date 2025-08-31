import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { AuthService } from './auth/auth.service';
import { EnvelopesListComponent } from './envelopes-list';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, EnvelopesListComponent],
  template: `
    <section style="padding:1rem">
      <h2>Home</h2>
      @if (authed()) {
      <p>Autenticado.</p>
      <pre style="white-space:pre-wrap;word-break:break-word">{{ claims() | json }}</pre>
      <button type="button" (click)="logout()">Sair</button>
      } @else {
      <p>Você não está autenticado.</p>
      <button type="button" (click)="login()">Entrar com Google</button>
      }
      <app-envelopes-list />
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  private readonly auth = inject(AuthService);
  readonly authed = computed(() => this.auth.isAuthenticated());
  readonly claims = computed(() => this.auth.user());
  readonly redirecting = computed(() => this.auth.isRedirecting());
  readonly error = computed(() => this.auth.error());

  logout(): void {
    this.auth.logout();
  }

  login(): void {
    void this.auth.login();
  }
}
