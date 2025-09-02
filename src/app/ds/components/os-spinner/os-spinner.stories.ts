import type { Meta, StoryObj } from '@storybook/web-components';
import './os-spinner';

const meta: Meta = { title: 'Components/Spinner', component: 'os-spinner' };
export default meta;

export const Default: StoryObj = { render: () => document.createElement('os-spinner') };
