import { Routes } from '@angular/router';

import { authGuard } from './auth/auth.guard';
import { HomePage } from './home.page.js';

export const routes: Routes = [{ path: '', canActivate: [authGuard], component: HomePage }];
