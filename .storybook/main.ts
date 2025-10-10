import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  stories: [
    '../src/**/*.mdx',
    '../src/app/shared/ui-components/atoms/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../src/app/shared/ui-components/molecules/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../src/app/shared/ui-components/organisms/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../src/app/shared/ui-components/templates/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: ['@storybook/addon-docs', '@storybook/addon-onboarding', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/angular',
    options: {
      enableIvy: true,
    },
  },
  staticDirs: ['../public'],
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
  webpackFinal: async (config) => {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@app': '/home/danilo/workspace/projeto-orca-sonhos/orca-sonhos-front/src/app',
        '@core': '/home/danilo/workspace/projeto-orca-sonhos/orca-sonhos-front/src/app/core',
        '@shared': '/home/danilo/workspace/projeto-orca-sonhos/orca-sonhos-front/src/app/shared',
        '@features':
          '/home/danilo/workspace/projeto-orca-sonhos/orca-sonhos-front/src/app/features',
        '@dtos': '/home/danilo/workspace/projeto-orca-sonhos/orca-sonhos-front/src/dtos',
      };
    }
    return config;
  },
};

export default config;
