import type { Meta, StoryObj } from '@storybook/angular';
import { OsAppShellTemplateComponent } from './os-app-shell-template.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService } from '@core/services/theme/theme.service';

const meta: Meta<OsAppShellTemplateComponent> = {
  title: 'Design System/Templates/App Shell Template',
  component: OsAppShellTemplateComponent,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (story) => ({
      ...story,
      moduleMetadata: {
        imports: [CommonModule, RouterModule],
        providers: [ThemeService],
      },
    }),
  ],
};

export default meta;
type Story = StoryObj<OsAppShellTemplateComponent>;

export const Default: Story = {
  args: {
    layout: {
      variant: 'default',
      size: 'medium',
      theme: 'light',
      showHeader: true,
      showSidebar: true,
      sidebarCollapsed: false,
    },
    headerLogoText: 'OrçaSonhos',
    headerLogoRoute: '/dashboard',
    headerNavigation: [],
    headerActions: [],
    headerUser: null,
    headerUserMenuItems: [],
    sidebarItems: [],
    sidebarTitle: 'Navegação',
    sidebarShowHeader: true,
    sidebarShowToggleButton: true,
    ariaLabel: 'Shell principal do aplicativo',
    loading: false,
    error: null,
    loadingText: 'Carregando...',
    errorText: 'Ocorreu um erro',
  },
};
