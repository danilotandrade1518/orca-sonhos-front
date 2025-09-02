const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host {
      display: block;
      background: var(--os-color-surface);
      color: var(--os-color-text);
      box-shadow: var(--os-shadow-1);
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .bar {
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      height: 56px;
      padding: 0 var(--os-space-4);
      gap: var(--os-space-4);
    }
    ::slotted([slot="start"]) { display: inline-flex; align-items: center; gap: var(--os-space-2); }
    ::slotted([slot="center"]) { display: inline-flex; align-items: center; justify-content: center; }
    ::slotted([slot="end"]) { display: inline-flex; align-items: center; gap: var(--os-space-2); justify-content: end; }
  </style>
  <div class="bar">
    <slot name="start"></slot>
    <slot name="center"></slot>
    <slot name="end"></slot>
  </div>
`;

export class OsAppbar extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('os-appbar', OsAppbar);
