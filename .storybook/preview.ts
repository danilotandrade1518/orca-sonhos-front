import type { Preview } from '@storybook/web-components';
import '../src/styles.scss';
import '../src/app/ds/preview-setup';

const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    options: { storySort: { order: ['Foundations', 'Components', 'Domain'] } },
    a11y: { disable: false },
  },
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Light or Dark theme',
      defaultValue: 'light',
      toolbar: {
        icon: 'mirror', // ícone de tema
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        showName: true,
      },
    },
  },
  decorators: [
    (story, context) => {
      const theme = context.globals.theme || 'light';
      document.documentElement.setAttribute('data-theme', theme);
      return story();
    },
  ],
};

export default preview;
