const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host {
      display: block;
    }
    .container {
      display: flex;
      flex-direction: column;
      gap: var(--os-space-1);
    }
    .label {
      color: var(--os-color-text-muted);
      font-size: var(--os-font-size-sm);
      line-height: var(--os-line-height-normal);
      font-family: var(--os-font-sans);
    }
    .value {
      font-weight: var(--os-font-weight-semibold);
      font-size: var(--os-font-size-2xl);
      line-height: var(--os-line-height-tight);
      color: var(--os-color-text);
      font-family: var(--os-font-sans);
    }
    :host([variant="positive"]) .value { color: var(--os-color-positive); }
    :host([variant="negative"]) .value { color: var(--os-color-negative); }
    :host([variant="info"]) .value { color: var(--os-color-info); }

    :host([size="sm"]) .value { font-size: var(--os-font-size-xl); }
    :host([size="lg"]) .value { font-size: 2rem; }

    .delta {
      display: inline-flex;
      align-items: center;
      gap: var(--os-space-1);
      font-size: var(--os-font-size-sm);
      font-family: var(--os-font-sans);
    }
    .delta.up { color: var(--os-color-positive); }
    .delta.down { color: var(--os-color-negative); }
    .delta.neutral { color: var(--os-color-text-muted); }

    .delta .icon::before { content: '•'; display: inline-block; }
    .delta.up .icon::before { content: '▲'; }
    .delta.down .icon::before { content: '▼'; }
  </style>
  <div class="container" part="container">
    <div class="label" part="label">
      <slot name="label"></slot>
      <span class="label-fallback"></span>
    </div>
    <div class="value" part="value">
      <slot name="value"></slot>
      <span class="value-fallback"></span>
    </div>
    <div class="delta neutral" part="delta" hidden>
      <span class="icon" aria-hidden="true"></span>
      <slot name="delta"></slot>
      <span class="delta-fallback"></span>
    </div>
  </div>
`;

export class OsKpi extends HTMLElement {
  static get observedAttributes() {
    return ['label', 'value', 'delta', 'delta-label', 'variant', 'size'];
  }

  private _root: ShadowRoot;
  private _els = {
    labelFallback: undefined as undefined | HTMLSpanElement,
    valueFallback: undefined as undefined | HTMLSpanElement,
    delta: undefined as undefined | HTMLDivElement,
    deltaFallback: undefined as undefined | HTMLSpanElement,
  };

  constructor() {
    super();
    this._root = this.attachShadow({ mode: 'open' });
    this._root.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this._cacheEls();
    this._renderAll();
  }

  attributeChangedCallback() {
    // Render incremental when attributes change
    if (!this._els.labelFallback) this._cacheEls();
    this._renderAll();
  }

  private _cacheEls() {
    this._els.labelFallback = this._root.querySelector('.label-fallback') as HTMLSpanElement;
    this._els.valueFallback = this._root.querySelector('.value-fallback') as HTMLSpanElement;
    this._els.delta = this._root.querySelector('.delta') as HTMLDivElement;
    this._els.deltaFallback = this._root.querySelector('.delta-fallback') as HTMLSpanElement;
  }

  private _renderAll() {
    this._renderText('label', this._els.labelFallback!);
    this._renderText('value', this._els.valueFallback!);
    this._renderDelta();
  }

  private _renderText(attr: 'label' | 'value', el: HTMLSpanElement) {
    const val = this.getAttribute(attr);
    el.textContent = val ?? '';
  }

  private _renderDelta() {
    const deltaEl = this._els.delta!;
    const raw = this.getAttribute('delta');
    const slotEl = this._root.querySelector('slot[name="delta"]') as HTMLSlotElement | null;
    const hasSlot = !!(slotEl && slotEl.assignedNodes().length > 0);
    const hasDelta = (raw != null && raw !== '') || hasSlot;
    deltaEl.hidden = !hasDelta;
    // Determine direction (up/down/neutral)
    let cls = 'neutral';
    const num = raw != null ? Number(raw) : NaN;
    if (!Number.isNaN(num)) {
      if (num > 0) cls = 'up';
      else if (num < 0) cls = 'down';
    }
    deltaEl.classList.remove('up', 'down', 'neutral');
    deltaEl.classList.add(cls);
    const fallback = this.getAttribute('delta-label') ?? raw ?? '';
    if (this._els.deltaFallback) this._els.deltaFallback.textContent = fallback;
    // If variant not set, infer from delta sign
    if (!this.hasAttribute('variant')) {
      if (cls === 'up') this.setAttribute('variant', 'positive');
      else if (cls === 'down') this.setAttribute('variant', 'negative');
      else this.setAttribute('variant', 'neutral');
    }
  }
}

customElements.define('os-kpi', OsKpi);
