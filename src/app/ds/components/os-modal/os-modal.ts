const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host { display: none; position: fixed; inset: 0; }
    :host([open]) { display: grid; }
    .backdrop { position: absolute; inset: 0; background: rgba(0,0,0,0.6); }
    .panel { position: relative; margin: auto; background: var(--os-color-elevated); color: var(--os-color-text); border-radius: var(--os-radius-lg); border: 1px solid rgba(255,255,255,0.06); min-width: 320px; max-width: 90vw; box-shadow: var(--os-shadow-2); }
    header, footer { padding: var(--os-space-3) var(--os-space-4); }
    main { padding: 0 var(--os-space-4) var(--os-space-4); }
    header { font-weight: 600; border-bottom: 1px solid rgba(255,255,255,0.06); }
    footer { border-top: 1px solid rgba(255,255,255,0.06); }
  </style>
  <div class="backdrop" part="backdrop"></div>
  <div class="panel" role="dialog" aria-modal="true">
    <header><slot name="title"></slot></header>
    <main><slot></slot></main>
    <footer><slot name="actions"></slot></footer>
  </div>
`;

export class OsModal extends HTMLElement {
  constructor() {
    super();
    const s = this.attachShadow({ mode: 'open' });
    s.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('os-modal', OsModal);
