import { setCompodocJson } from '@storybook/addon-docs/angular';

import type { Preview } from '@storybook/angular';
// Import global styles - temporarily disabled due to SCSS processing issues
// import '../src/styles.scss';

// Add Material Icons font directly
const materialIconsLink = document.createElement('link');
materialIconsLink.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
materialIconsLink.rel = 'stylesheet';
document.head.appendChild(materialIconsLink);

// Import Compodoc documentation if available
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const docJson = require('../documentation.json');
  setCompodocJson(docJson);
} catch {
  console.warn('Compodoc documentation not found. Run "npm run docs:json" to generate it.');
}

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      expanded: true,
      sort: 'requiredFirst',
    },
    docs: {
      toc: true,
      source: {
        type: 'code',
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#333333' },
        { name: 'blue', value: '#1976d2' },
      ],
    },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: { width: '375px', height: '667px' },
        },
        tablet: {
          name: 'Tablet',
          styles: { width: '768px', height: '1024px' },
        },
        desktop: {
          name: 'Desktop',
          styles: { width: '1024px', height: '768px' },
        },
        large: {
          name: 'Large Desktop',
          styles: { width: '1440px', height: '900px' },
        },
      },
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'keyboard-navigation',
            enabled: true,
          },
          {
            id: 'focus-management',
            enabled: true,
          },
        ],
      },
      options: {
        checks: { 'color-contrast': { options: { noScroll: true } } },
        restoreScroll: true,
      },
    },
  },
  tags: ['autodocs'],
};

export default preview;
