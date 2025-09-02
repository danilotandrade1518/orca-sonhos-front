const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host {
      display: flex;
      flex-direction: column;
      gap: var(--os-space-1);
      width: 100%;
    }
    .label {
  font-size: var(--os-font-size-sm);
  color: var(--os-color-text-muted);
  font-weight: var(--os-font-weight-medium);
    }
    .error {
      color: var(--os-color-danger);
      font-size: var(--os-font-size-xs);
      margin-top: 2px;
    }
    ::slotted([slot="label"]) {
  font-size: var(--os-font-size-sm);
  color: var(--os-color-text-muted);
  font-weight: var(--os-font-weight-medium);
    }
    ::slotted([slot="error"]) {
      color: var(--os-color-danger);
      font-size: var(--os-font-size-xs);
      margin-top: 2px;
    }
  </style>
  <slot name="label"></slot>
  <slot></slot>
  <slot name="error"></slot>
`;

export class OsField extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('os-field', OsField);
