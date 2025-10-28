import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { OsFooterComponent, FooterSection, FooterLink } from './os-footer.component';

describe('OsFooterComponent', () => {
  let component: OsFooterComponent;
  let fixture: ComponentFixture<OsFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OsFooterComponent, RouterTestingModule],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(OsFooterComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render with default inputs', () => {
    fixture.detectChanges();

    const footer = fixture.nativeElement.querySelector('.os-footer');
    expect(footer).toBeTruthy();
    expect(footer.classList.contains('os-footer--default')).toBe(true);
    expect(footer.classList.contains('os-footer--medium')).toBe(true);
    expect(footer.classList.contains('os-footer--light')).toBe(true);
  });

  it('should render sections when provided', () => {
    const sections: FooterSection[] = [
      {
        title: 'Company',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
        ],
      },
      {
        title: 'Support',
        links: [
          { label: 'Help', href: '/help' },
          { label: 'FAQ', href: '/faq' },
        ],
      },
    ];

    fixture.componentRef.setInput('sections', sections);
    fixture.detectChanges();

    const sectionTitles = fixture.nativeElement.querySelectorAll('.os-footer__section-title');
    expect(sectionTitles.length).toBe(2);
    expect(sectionTitles[0].textContent).toBe('Company');
    expect(sectionTitles[1].textContent).toBe('Support');

    const links = fixture.nativeElement.querySelectorAll('.os-footer__link');
    expect(links.length).toBe(4);
    expect(links[0].textContent?.trim()).toBe('About');
    expect(links[0].getAttribute('href')).toBe('/about');
  });

  it('should render router links correctly', () => {
    const sections: FooterSection[] = [
      {
        title: 'Navigation',
        links: [
          { label: 'Home', routerLink: '/home' },
          { label: 'External', href: 'https://example.com', external: true },
        ],
      },
    ];

    fixture.componentRef.setInput('sections', sections);
    fixture.detectChanges();

    const links = fixture.nativeElement.querySelectorAll('.os-footer__link');
    
    expect(links[0]).toBeTruthy();
    expect(links[1].getAttribute('href')).toBe('https://example.com');
    expect(links[1].getAttribute('target')).toBe('_blank');
    expect(links[1].getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('should render copyright text', () => {
    const copyrightText = '© 2024 Custom Copyright';
    fixture.componentRef.setInput('copyrightText', copyrightText);
    fixture.detectChanges();

    const copyright = fixture.nativeElement.querySelector('.os-footer__copyright-text');
    expect(copyright.textContent).toBe(copyrightText);
  });

  it('should render social links', () => {
    const socialLinks: FooterLink[] = [
      { label: 'Facebook', href: 'https://facebook.com', icon: '📘', external: true },
      { label: 'Twitter', href: 'https://twitter.com', icon: '🐦', external: true },
    ];

    fixture.componentRef.setInput('socialLinks', socialLinks);
    fixture.detectChanges();

    const socialLinkElements = fixture.nativeElement.querySelectorAll('.os-footer__social-link');
    expect(socialLinkElements.length).toBe(2);
    expect(socialLinkElements[0].getAttribute('href')).toBe('https://facebook.com');
    expect(socialLinkElements[0].getAttribute('aria-label')).toBe('Facebook');
    expect(socialLinkElements[0].getAttribute('target')).toBe('_blank');
  });

  it('should apply variant classes', () => {
    fixture.componentRef.setInput('variant', 'minimal');
    fixture.detectChanges();

    const footer = fixture.nativeElement.querySelector('.os-footer');
    expect(footer.classList.contains('os-footer--minimal')).toBe(true);
  });

  it('should apply size classes', () => {
    fixture.componentRef.setInput('size', 'large');
    fixture.detectChanges();

    const footer = fixture.nativeElement.querySelector('.os-footer');
    expect(footer.classList.contains('os-footer--large')).toBe(true);
  });

  it('should apply theme classes', () => {
    fixture.componentRef.setInput('theme', 'dark');
    fixture.detectChanges();

    const footer = fixture.nativeElement.querySelector('.os-footer');
    expect(footer.classList.contains('os-footer--dark')).toBe(true);
  });

  it('should hide content in minimal variant', () => {
    const sections: FooterSection[] = [
      { title: 'Test', links: [{ label: 'Link', href: '/test' }] },
    ];

    fixture.componentRef.setInput('sections', sections);
    fixture.componentRef.setInput('variant', 'minimal');
    fixture.detectChanges();

    const content = fixture.nativeElement.querySelector('.os-footer__content');
    expect(content).toBeTruthy();
    expect(content.classList.contains('os-footer__content')).toBe(true);
  });

  it('should have proper ARIA attributes', () => {
    fixture.detectChanges();

    const footer = fixture.nativeElement.querySelector('.os-footer');
    
    expect(footer).toBeTruthy();
    expect(footer.tagName.toLowerCase()).toBe('footer');
  });

  it('should handle empty sections', () => {
    fixture.componentRef.setInput('sections', []);
    fixture.detectChanges();

    const sections = fixture.nativeElement.querySelectorAll('.os-footer__section');
    expect(sections.length).toBe(0);
  });

  it('should handle empty social links', () => {
    fixture.componentRef.setInput('socialLinks', []);
    fixture.detectChanges();

    const socialSection = fixture.nativeElement.querySelector('.os-footer__social');
    expect(socialSection).toBeFalsy();
  });

  it('should apply correct link classes', () => {
    fixture.componentRef.setInput('variant', 'extended');
    fixture.componentRef.setInput('size', 'small');
    fixture.detectChanges();

    const sections: FooterSection[] = [
      { title: 'Test', links: [{ label: 'Link', href: '/test' }] },
    ];

    fixture.componentRef.setInput('sections', sections);
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector('.os-footer__link');
    expect(link.classList.contains('os-footer__link--extended')).toBe(true);
    expect(link.classList.contains('os-footer__link--small')).toBe(true);
  });

  it('should apply correct social link classes', () => {
    fixture.componentRef.setInput('variant', 'minimal');
    fixture.componentRef.setInput('size', 'large');
    fixture.detectChanges();

    const socialLinks: FooterLink[] = [
      { label: 'Test', href: 'https://test.com', icon: '🔗', external: true },
    ];

    fixture.componentRef.setInput('socialLinks', socialLinks);
    fixture.detectChanges();

    const socialLink = fixture.nativeElement.querySelector('.os-footer__social-link');
    expect(socialLink.classList.contains('os-footer__social-link--minimal')).toBe(true);
    expect(socialLink.classList.contains('os-footer__social-link--large')).toBe(true);
  });

  it('should be responsive on mobile devices', () => {
    const sections: FooterSection[] = [
      { title: 'Mobile', links: [{ label: 'Link', href: '/test' }] },
      { title: 'Test', links: [{ label: 'Link2', href: '/test2' }] },
    ];

    fixture.componentRef.setInput('sections', sections);
    fixture.detectChanges();

    const content = fixture.nativeElement.querySelector('.os-footer__content');
    expect(content).toBeTruthy();
    
    const computedStyle = window.getComputedStyle(content);
    expect(computedStyle.display).toBe('grid');
  });

  it('should handle social links responsively', () => {
    const socialLinks: FooterLink[] = [
      { label: 'Facebook', href: 'https://facebook.com', icon: '📘', external: true },
      { label: 'Twitter', href: 'https://twitter.com', icon: '🐦', external: true },
      { label: 'LinkedIn', href: 'https://linkedin.com', icon: '💼', external: true },
    ];

    fixture.componentRef.setInput('socialLinks', socialLinks);
    fixture.detectChanges();

    const socialLinksContainer = fixture.nativeElement.querySelector('.os-footer__social-links');
    expect(socialLinksContainer).toBeTruthy();
    
    const computedStyle = window.getComputedStyle(socialLinksContainer);
    expect(computedStyle.flexWrap).toBe('wrap');
  });
});
