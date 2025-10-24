import type { Meta, StoryObj } from '@storybook/angular';
import { OsFooterComponent } from './os-footer.component';

const meta: Meta<OsFooterComponent> = {
  title: 'Design System/Organisms/Footer',
  component: OsFooterComponent,
  parameters: {
    docs: {
      description: {
        component:
          'Rodapé do Design System Orca Sonhos com seções de links, copyright e links sociais.',
      },
    },
  },
  argTypes: {
    sections: {
      control: { type: 'object' },
      description: 'Seções do rodapé com links',
    },
    copyrightText: {
      control: { type: 'text' },
      description: 'Texto de copyright',
    },
    socialLinks: {
      control: { type: 'object' },
      description: 'Links sociais',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'minimal', 'extended'],
      description: 'Variante do rodapé',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Tamanho do rodapé',
    },
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark'],
      description: 'Tema do rodapé',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<OsFooterComponent>;

const sampleSections = [
  {
    title: 'Produto',
    links: [
      { label: 'Recursos', routerLink: '/features', icon: '🚀' },
      { label: 'Preços', routerLink: '/pricing', icon: '💰' },
      { label: 'API', routerLink: '/api', icon: '⚡' },
      { label: 'Integrações', routerLink: '/integrations', icon: '🔗' },
    ],
  },
  {
    title: 'Empresa',
    links: [
      { label: 'Sobre', routerLink: '/about', icon: '🏢' },
      { label: 'Blog', routerLink: '/blog', icon: '📝' },
      { label: 'Carreiras', routerLink: '/careers', icon: '👥' },
      { label: 'Imprensa', routerLink: '/press', icon: '📰' },
    ],
  },
  {
    title: 'Suporte',
    links: [
      { label: 'Central de Ajuda', routerLink: '/help', icon: '❓' },
      { label: 'Documentação', routerLink: '/docs', icon: '📚' },
      { label: 'Contato', routerLink: '/contact', icon: '📞' },
      { label: 'Status', href: 'https://status.orcasonhos.com', external: true, icon: '📊' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Termos de Uso', routerLink: '/terms', icon: '📄' },
      { label: 'Política de Privacidade', routerLink: '/privacy', icon: '🔒' },
      { label: 'Cookies', routerLink: '/cookies', icon: '🍪' },
      { label: 'LGPD', routerLink: '/lgpd', icon: '⚖️' },
    ],
  },
];

const sampleSocialLinks = [
  { label: 'Facebook', href: 'https://facebook.com/orcasonhos', icon: '📘', external: true },
  { label: 'Twitter', href: 'https://twitter.com/orcasonhos', icon: '🐦', external: true },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/company/orcasonhos',
    icon: '💼',
    external: true,
  },
  { label: 'Instagram', href: 'https://instagram.com/orcasonhos', icon: '📷', external: true },
  { label: 'YouTube', href: 'https://youtube.com/orcasonhos', icon: '📺', external: true },
];

export const Default: Story = {
  args: {
    sections: sampleSections,
    copyrightText: '© 2024 OrçaSonhos. Todos os direitos reservados.',
    socialLinks: sampleSocialLinks,
    variant: 'default',
    size: 'medium',
    theme: 'light',
  },
  render: (args) => ({
    props: args,
    template: `
      <os-footer
        [sections]="sections"
        [copyrightText]="copyrightText"
        [socialLinks]="socialLinks"
        [variant]="variant"
        [size]="size"
        [theme]="theme"
      ></os-footer>
    `,
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Default</h4>
          <os-footer
            [sections]="sampleSections"
            [socialLinks]="sampleSocialLinks"
            variant="default"
          ></os-footer>
        </div>

        <div>
          <h4>Minimal</h4>
          <os-footer
            [sections]="sampleSections.slice(0, 2)"
            [socialLinks]="sampleSocialLinks.slice(0, 3)"
            variant="minimal"
          ></os-footer>
        </div>

        <div>
          <h4>Extended</h4>
          <os-footer
            [sections]="sampleSections"
            [socialLinks]="sampleSocialLinks"
            variant="extended"
          ></os-footer>
        </div>
      </div>
    `,
    props: {
      sampleSections,
      sampleSocialLinks,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todas as variantes disponíveis do rodapé.',
      },
    },
  },
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Small</h4>
          <os-footer
            [sections]="sampleSections.slice(0, 2)"
            [socialLinks]="sampleSocialLinks.slice(0, 3)"
            size="small"
          ></os-footer>
        </div>

        <div>
          <h4>Medium</h4>
          <os-footer
            [sections]="sampleSections.slice(0, 3)"
            [socialLinks]="sampleSocialLinks"
            size="medium"
          ></os-footer>
        </div>

        <div>
          <h4>Large</h4>
          <os-footer
            [sections]="sampleSections"
            [socialLinks]="sampleSocialLinks"
            size="large"
          ></os-footer>
        </div>
      </div>
    `,
    props: {
      sampleSections,
      sampleSocialLinks,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todos os tamanhos disponíveis do rodapé.',
      },
    },
  },
};

export const WithSocialLinks: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Com Links Sociais</h4>
          <os-footer
            [sections]="sampleSections.slice(0, 2)"
            [socialLinks]="sampleSocialLinks"
          ></os-footer>
        </div>

        <div>
          <h4>Sem Links Sociais</h4>
          <os-footer
            [sections]="sampleSections.slice(0, 2)"
            [socialLinks]="[]"
          ></os-footer>
        </div>
      </div>
    `,
    props: {
      sampleSections,
      sampleSocialLinks,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Rodapé com e sem links sociais.',
      },
    },
  },
};

export const WithExternalLinks: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Com Links Externos</h4>
          <os-footer
            [sections]="[
              {
                title: 'Recursos',
                links: [
                  { label: 'Documentação', href: 'https://docs.orcasonhos.com', external: true },
                  { label: 'API', href: 'https://api.orcasonhos.com', external: true },
                  { label: 'Status', href: 'https://status.orcasonhos.com', external: true }
                ]
              },
              {
                title: 'Social',
                links: [
                  { label: 'GitHub', href: 'https://github.com/orcasonhos', external: true },
                  { label: 'Discord', href: 'https://discord.gg/orcasonhos', external: true },
                  { label: 'Reddit', href: 'https://reddit.com/r/orcasonhos', external: true }
                ]
              }
            ]"
            [socialLinks]="sampleSocialLinks"
          ></os-footer>
        </div>
      </div>
    `,
    props: {
      sampleSocialLinks,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Rodapé com links externos que abrem em nova aba.',
      },
    },
  },
};

export const DarkTheme: Story = {
  render: () => ({
    template: `
      <div style="background-color: #1a1a1a; padding: 20px; border-radius: 8px;">
        <h4 style="color: white; margin-bottom: 16px;">Tema Escuro</h4>
        <os-footer
          [sections]="sampleSections"
          [socialLinks]="sampleSocialLinks"
          theme="dark"
        ></os-footer>
      </div>
    `,
    props: {
      sampleSections,
      sampleSocialLinks,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Rodapé com tema escuro.',
      },
    },
  },
};

export const MinimalFooter: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Rodapé Mínimo</h4>
          <os-footer
            [sections]="[
              {
                title: 'Links Rápidos',
                links: [
                  { label: 'Sobre', routerLink: '/about' },
                  { label: 'Contato', routerLink: '/contact' },
                  { label: 'Ajuda', routerLink: '/help' }
                ]
              }
            ]"
            [socialLinks]="sampleSocialLinks.slice(0, 3)"
            variant="minimal"
            size="small"
          ></os-footer>
        </div>

        <div>
          <h4>Apenas Copyright</h4>
          <os-footer
            [sections]="[]"
            [socialLinks]="[]"
            variant="minimal"
            size="small"
            copyrightText="© 2024 OrçaSonhos. Todos os direitos reservados."
          ></os-footer>
        </div>
      </div>
    `,
    props: {
      sampleSocialLinks,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Rodapé mínimo com poucas seções ou apenas copyright.',
      },
    },
  },
};

export const ExtendedFooter: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Rodapé Estendido</h4>
          <os-footer
            [sections]="[
              {
                title: 'Produto',
                links: [
                  { label: 'Recursos', routerLink: '/features' },
                  { label: 'Preços', routerLink: '/pricing' },
                  { label: 'API', routerLink: '/api' },
                  { label: 'Integrações', routerLink: '/integrations' },
                  { label: 'Changelog', routerLink: '/changelog' },
                  { label: 'Roadmap', routerLink: '/roadmap' }
                ]
              },
              {
                title: 'Empresa',
                links: [
                  { label: 'Sobre', routerLink: '/about' },
                  { label: 'Blog', routerLink: '/blog' },
                  { label: 'Carreiras', routerLink: '/careers' },
                  { label: 'Imprensa', routerLink: '/press' },
                  { label: 'Parceiros', routerLink: '/partners' },
                  { label: 'Investidores', routerLink: '/investors' }
                ]
              },
              {
                title: 'Suporte',
                links: [
                  { label: 'Central de Ajuda', routerLink: '/help' },
                  { label: 'Documentação', routerLink: '/docs' },
                  { label: 'Contato', routerLink: '/contact' },
                  { label: 'Status', href: 'https://status.orcasonhos.com', external: true },
                  { label: 'Comunidade', routerLink: '/community' },
                  { label: 'Tutoriais', routerLink: '/tutorials' }
                ]
              },
              {
                title: 'Legal',
                links: [
                  { label: 'Termos de Uso', routerLink: '/terms' },
                  { label: 'Política de Privacidade', routerLink: '/privacy' },
                  { label: 'Cookies', routerLink: '/cookies' },
                  { label: 'LGPD', routerLink: '/lgpd' },
                  { label: 'Segurança', routerLink: '/security' },
                  { label: 'Compliance', routerLink: '/compliance' }
                ]
              }
            ]"
            [socialLinks]="sampleSocialLinks"
            variant="extended"
            size="large"
          ></os-footer>
        </div>
      </div>
    `,
    props: {
      sampleSocialLinks,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Rodapé estendido com muitas seções e links.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    sections: sampleSections,
    copyrightText: '© 2024 OrçaSonhos. Todos os direitos reservados.',
    socialLinks: sampleSocialLinks,
    variant: 'default',
    size: 'medium',
    theme: 'light',
  },
  render: (args) => ({
    props: args,
    template: `
      <os-footer
        [sections]="sections"
        [copyrightText]="copyrightText"
        [socialLinks]="socialLinks"
        [variant]="variant"
        [size]="size"
        [theme]="theme"
      ></os-footer>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Rodapé interativo com controles para testar todas as propriedades.',
      },
    },
  },
};
