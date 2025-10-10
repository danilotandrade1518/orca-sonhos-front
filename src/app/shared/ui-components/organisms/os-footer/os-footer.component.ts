import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface FooterLink {
  label: string;
  href?: string;
  routerLink?: string;
  external?: boolean;
  icon?: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

@Component({
  selector: 'os-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="os-footer" [class]="footerClasses()">
      <div class="os-footer__container">
        <div class="os-footer__content">
          @for (section of sections(); track section.title) {
          <div class="os-footer__section">
            <h3 class="os-footer__section-title">{{ section.title }}</h3>
            <ul class="os-footer__links">
              @for (link of section.links; track link.label) {
              <li class="os-footer__link-item">
                @if (link.routerLink) {
                <a [routerLink]="link.routerLink" class="os-footer__link" [class]="linkClasses()">
                  {{ link.label }}
                </a>
                } @else {
                <a
                  [href]="link.href"
                  class="os-footer__link"
                  [class]="linkClasses()"
                  [target]="link.external ? '_blank' : null"
                  [rel]="link.external ? 'noopener noreferrer' : null"
                >
                  {{ link.label }}
                </a>
                }
              </li>
              }
            </ul>
          </div>
          }
        </div>

        <div class="os-footer__bottom">
          <div class="os-footer__copyright">
            <p class="os-footer__copyright-text">{{ copyrightText() }}</p>
          </div>

          @if (socialLinks().length > 0) {
          <div class="os-footer__social">
            <ul class="os-footer__social-links">
              @for (social of socialLinks(); track social.label) {
              <li class="os-footer__social-item">
                <a
                  [href]="social.href"
                  class="os-footer__social-link"
                  [class]="socialLinkClasses()"
                  [target]="social.external ? '_blank' : null"
                  [rel]="social.external ? 'noopener noreferrer' : null"
                  [attr.aria-label]="social.label"
                >
                  <span class="os-footer__social-icon" [attr.aria-hidden]="true">
                    {{ social.icon }}
                  </span>
                </a>
              </li>
              }
            </ul>
          </div>
          }
        </div>
      </div>
    </footer>
  `,
  styleUrls: ['./os-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.role]': '"contentinfo"',
    '[attr.aria-label]': '"Footer"',
  },
})
export class OsFooterComponent {
  // Inputs
  sections = input<FooterSection[]>([]);
  copyrightText = input('© 2024 OrçaSonhos. Todos os direitos reservados.');
  socialLinks = input<FooterLink[]>([]);
  variant = input<'default' | 'minimal' | 'extended'>('default');
  size = input<'small' | 'medium' | 'large'>('medium');
  theme = input<'light' | 'dark'>('light');

  // Computed properties
  footerClasses = computed(() => {
    return [
      `os-footer--${this.variant()}`,
      `os-footer--${this.size()}`,
      `os-footer--${this.theme()}`,
    ].join(' ');
  });

  linkClasses = computed(() => {
    return [`os-footer__link--${this.variant()}`, `os-footer__link--${this.size()}`].join(' ');
  });

  socialLinkClasses = computed(() => {
    return [
      `os-footer__social-link--${this.variant()}`,
      `os-footer__social-link--${this.size()}`,
    ].join(' ');
  });
}
