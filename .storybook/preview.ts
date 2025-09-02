import type { Preview } from '@storybook/web-components';
import '../src/styles.scss';
import '../src/app/ds/preview-setup';

const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    options: { storySort: { order: ['Foundations', 'Components', 'Domain'] } },
    a11y: { disable: false },
  },
};

export default preview;
