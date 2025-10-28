import type { Meta, StoryObj } from '@storybook/angular';
import { signal } from '@angular/core';
import { NotificationContainerComponent } from './notification-container.component';
import {
  NotificationService,
  Notification,
} from '../../../../core/services/notification/notification.service';
import { OsAlertType } from '../../molecules/os-alert/os-alert.component';

class MockNotificationService {
  private _notifications = signal<Notification[]>([]);
  private _isLoading = signal<boolean>(false);

  readonly notifications = this._notifications.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly hasNotifications = () => this._notifications().length > 0;

  setNotifications(notifications: Notification[]) {
    this._notifications.set(notifications);
  }

  setLoading(loading: boolean) {
    this._isLoading.set(loading);
  }

  dismissNotification = (id: string) => {
    this._notifications.update((notifications) => notifications.filter((n) => n.id !== id));
  };
}

const meta: Meta<NotificationContainerComponent> = {
  title: 'Design System/Organisms/Notification Container',
  component: NotificationContainerComponent,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Componente container para exibir notificações globais e estado de loading da aplicação. Integra com o NotificationService para gerenciar notificações e com os componentes os-spinner e os-alert do Design System.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<NotificationContainerComponent>;

export const Default: Story = {
  decorators: [
    (story) => {
      const mockService = new MockNotificationService();
      return {
        ...story,
        moduleMetadata: {
          providers: [{ provide: NotificationService, useValue: mockService }],
        },
      };
    },
  ],
  parameters: {
    docs: {
      description: {
        story: 'Estado padrão do componente sem notificações e sem loading ativo.',
      },
    },
  },
};

export const Loading: Story = {
  decorators: [
    (story) => {
      const mockService = new MockNotificationService();
      mockService.setLoading(true);
      return {
        ...story,
        moduleMetadata: {
          providers: [{ provide: NotificationService, useValue: mockService }],
        },
      };
    },
  ],
  parameters: {
    docs: {
      description: {
        story: 'Componente com estado de loading ativo, exibindo o spinner global.',
      },
    },
  },
};

export const SingleSuccessNotification: Story = {
  decorators: [
    (story) => {
      const mockService = new MockNotificationService();
      mockService.setNotifications([
        {
          id: 'success-1',
          type: 'success',
          message: 'Operação realizada com sucesso!',
          title: 'Sucesso',
          dismissible: true,
          duration: 5000,
        },
      ]);
      return {
        ...story,
        moduleMetadata: {
          providers: [{ provide: NotificationService, useValue: mockService }],
        },
      };
    },
  ],
  parameters: {
    docs: {
      description: {
        story: 'Exibindo uma única notificação de sucesso com título e mensagem.',
      },
    },
  },
};

export const SingleErrorNotification: Story = {
  decorators: [
    (story) => {
      const mockService = new MockNotificationService();
      mockService.setNotifications([
        {
          id: 'error-1',
          type: 'error',
          message: 'Ocorreu um erro ao processar sua solicitação. Tente novamente.',
          title: 'Erro',
          dismissible: true,
          duration: 8000,
        },
      ]);
      return {
        ...story,
        moduleMetadata: {
          providers: [{ provide: NotificationService, useValue: mockService }],
        },
      };
    },
  ],
  parameters: {
    docs: {
      description: {
        story: 'Exibindo uma única notificação de erro com título e mensagem detalhada.',
      },
    },
  },
};

export const SingleWarningNotification: Story = {
  decorators: [
    (story) => {
      const mockService = new MockNotificationService();
      mockService.setNotifications([
        {
          id: 'warning-1',
          type: 'warning',
          message: 'Atenção: Esta ação não pode ser desfeita.',
          title: 'Aviso',
          dismissible: true,
          duration: 6000,
        },
      ]);
      return {
        ...story,
        moduleMetadata: {
          providers: [{ provide: NotificationService, useValue: mockService }],
        },
      };
    },
  ],
  parameters: {
    docs: {
      description: {
        story: 'Exibindo uma única notificação de aviso com título e mensagem de atenção.',
      },
    },
  },
};

export const SingleInfoNotification: Story = {
  decorators: [
    (story) => {
      const mockService = new MockNotificationService();
      mockService.setNotifications([
        {
          id: 'info-1',
          type: 'info',
          message: 'Nova funcionalidade disponível! Confira as atualizações.',
          title: 'Informação',
          dismissible: true,
          duration: 4000,
        },
      ]);
      return {
        ...story,
        moduleMetadata: {
          providers: [{ provide: NotificationService, useValue: mockService }],
        },
      };
    },
  ],
  parameters: {
    docs: {
      description: {
        story: 'Exibindo uma única notificação informativa com título e mensagem.',
      },
    },
  },
};

export const NotificationWithoutTitle: Story = {
  decorators: [
    (story) => {
      const mockService = new MockNotificationService();
      mockService.setNotifications([
        {
          id: 'no-title-1',
          type: 'success',
          message: 'Notificação sem título',
          dismissible: true,
          duration: 5000,
        },
      ]);
      return {
        ...story,
        moduleMetadata: {
          providers: [{ provide: NotificationService, useValue: mockService }],
        },
      };
    },
  ],
  parameters: {
    docs: {
      description: {
        story: 'Exibindo uma notificação sem título, apenas com a mensagem.',
      },
    },
  },
};

export const NonDismissibleNotification: Story = {
  decorators: [
    (story) => {
      const mockService = new MockNotificationService();
      mockService.setNotifications([
        {
          id: 'non-dismissible-1',
          type: 'error',
          message: 'Erro crítico que requer atenção imediata',
          title: 'Erro Crítico',
          dismissible: false,
          duration: 0,
        },
      ]);
      return {
        ...story,
        moduleMetadata: {
          providers: [{ provide: NotificationService, useValue: mockService }],
        },
      };
    },
  ],
  parameters: {
    docs: {
      description: {
        story: 'Exibindo uma notificação que não pode ser dispensada pelo usuário.',
      },
    },
  },
};

export const MultipleNotifications: Story = {
  decorators: [
    (story) => {
      const mockService = new MockNotificationService();
      mockService.setNotifications([
        {
          id: 'success-1',
          type: 'success',
          message: 'Dados salvos com sucesso',
          title: 'Sucesso',
          dismissible: true,
          duration: 5000,
        },
        {
          id: 'warning-1',
          type: 'warning',
          message: 'Alguns campos foram preenchidos automaticamente',
          title: 'Atenção',
          dismissible: true,
          duration: 6000,
        },
        {
          id: 'info-1',
          type: 'info',
          message: 'Sincronização em andamento...',
          title: 'Informação',
          dismissible: true,
          duration: 4000,
        },
      ]);
      return {
        ...story,
        moduleMetadata: {
          providers: [{ provide: NotificationService, useValue: mockService }],
        },
      };
    },
  ],
  parameters: {
    docs: {
      description: {
        story: 'Exibindo múltiplas notificações de diferentes tipos simultaneamente.',
      },
    },
  },
};

export const LoadingWithNotifications: Story = {
  decorators: [
    (story) => {
      const mockService = new MockNotificationService();
      mockService.setLoading(true);
      mockService.setNotifications([
        {
          id: 'loading-1',
          type: 'info',
          message: 'Processando dados...',
          title: 'Processamento',
          dismissible: true,
          duration: 0,
        },
      ]);
      return {
        ...story,
        moduleMetadata: {
          providers: [{ provide: NotificationService, useValue: mockService }],
        },
      };
    },
  ],
  parameters: {
    docs: {
      description: {
        story:
          'Estado de loading ativo com notificações simultâneas, simulando uma operação em andamento.',
      },
    },
  },
};

export const ManyNotifications: Story = {
  decorators: [
    (story) => {
      const mockService = new MockNotificationService();
      mockService.setNotifications(
        Array.from({ length: 8 }, (_, index) => ({
          id: `notification-${index + 1}`,
          type: ['success', 'error', 'warning', 'info'][index % 4] as OsAlertType,
          message: `Mensagem de notificação número ${index + 1}`,
          title: `Notificação ${index + 1}`,
          dismissible: true,
          duration: 5000,
        }))
      );
      return {
        ...story,
        moduleMetadata: {
          providers: [{ provide: NotificationService, useValue: mockService }],
        },
      };
    },
  ],
  parameters: {
    docs: {
      description: {
        story: 'Múltiplas notificações para testar o comportamento de scroll e layout.',
      },
    },
  },
};

export const DifferentDurations: Story = {
  decorators: [
    (story) => {
      const mockService = new MockNotificationService();
      mockService.setNotifications([
        {
          id: 'short-1',
          type: 'info',
          message: 'Notificação de curta duração (2s)',
          title: 'Curta',
          dismissible: true,
          duration: 2000,
        },
        {
          id: 'medium-1',
          type: 'warning',
          message: 'Notificação de duração média (6s)',
          title: 'Média',
          dismissible: true,
          duration: 6000,
        },
        {
          id: 'long-1',
          type: 'error',
          message: 'Notificação de longa duração (10s)',
          title: 'Longa',
          dismissible: true,
          duration: 10000,
        },
        {
          id: 'permanent-1',
          type: 'info',
          message: 'Notificação permanente (não auto-dismiss)',
          title: 'Permanente',
          dismissible: true,
          duration: 0,
        },
      ]);
      return {
        ...story,
        moduleMetadata: {
          providers: [{ provide: NotificationService, useValue: mockService }],
        },
      };
    },
  ],
  parameters: {
    docs: {
      description: {
        story:
          'Notificações com diferentes durações de auto-dismiss para demonstrar o comportamento temporal.',
      },
    },
  },
};

export const LongMessages: Story = {
  decorators: [
    (story) => {
      const mockService = new MockNotificationService();
      mockService.setNotifications([
        {
          id: 'long-message-1',
          type: 'error',
          message:
            'Esta é uma mensagem de erro muito longa que pode ocupar várias linhas e testar como o componente se comporta com textos extensos que podem quebrar o layout ou causar problemas de visualização.',
          title: 'Mensagem Longa',
          dismissible: true,
          duration: 8000,
        },
        {
          id: 'long-title-1',
          type: 'warning',
          message: 'Mensagem normal',
          title: 'Este é um título muito longo que pode causar problemas de layout',
          dismissible: true,
          duration: 6000,
        },
      ]);
      return {
        ...story,
        moduleMetadata: {
          providers: [{ provide: NotificationService, useValue: mockService }],
        },
      };
    },
  ],
  parameters: {
    docs: {
      description: {
        story: 'Notificações com mensagens e títulos longos para testar o comportamento do layout.',
      },
    },
  },
};
