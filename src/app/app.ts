import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationContainerComponent } from './shared/ui-components/organisms/notification-container/notification-container.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NotificationContainerComponent],
  template: `
    <router-outlet />
    <os-notification-container />
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
