const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host { display: block; }
    .label { display: flex; justify-content: space-between; margin-bottom: var(--os-space-2); font-size: var(--os-font-size-sm); }
    .bar { height: 8px; background: rgba(255,255,255,0.08); border-radius: 999px; overflow: hidden; }
    .fill { height: 100%; background: var(--os-color-primary); width: 0%; }
  </style>
  <div class="label"><span class="name"></span><span class="value"></span></div>
  <div class="bar"><div class="fill"></div></div>
`;

export class OsGoalProgress extends HTMLElement {
  static get observedAttributes() {
    return ['name', 'value', 'target'];
  }
  private _name!: HTMLElement;
  private _value!: HTMLElement;
  private _fill!: HTMLElement;
  constructor() {
    super();
    const s = this.attachShadow({ mode: 'open' });
    s.appendChild(template.content.cloneNode(true));
    this._name = s.querySelector('.name')!;
    this._value = s.querySelector('.value')!;
    this._fill = s.querySelector('.fill')!;
  }
  connectedCallback() {
    this._render();
  }
  attributeChangedCallback() {
    this._render();
  }
  private _render() {
    const name = this.getAttribute('name') || '';
    const value = Number(this.getAttribute('value') || '0');
    const target = Number(this.getAttribute('target') || '100');
    const pct = target > 0 ? Math.min(100, Math.round((value / target) * 100)) : 0;
    this._name.textContent = name;
    this._value.textContent = `${pct}%`;
    this._fill.style.width = pct + '%';
  }
}

customElements.define('os-goal-progress', OsGoalProgress);
