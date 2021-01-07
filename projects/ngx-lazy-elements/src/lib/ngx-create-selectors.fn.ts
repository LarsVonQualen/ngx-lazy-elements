export interface NgxSelectors<TBaseSelector extends string> {
  /**
   * Used only internally, would never be exposed in templates etc.
   * Would be: ngx-lazy-component-${TBaseSelector}
   * @todo After TS 4.1 upgrade: `ngx-lazy-component-${TBaseSelector}`
   */
  lazyComponent: string;
  /**
   * Selector for the actual lazy loaded component, used in the template for
   * a lazy loaded component.
   * Would be: ngx-lazy-loaded-${TBaseSelector}
   * @todo After TS 4.1 upgrade: `ngx-lazy-loaded-${TBaseSelector}`
   */
  lazyLoadedComponent: string;
  /**
   * Not actually used anywhere.
   * Would be: ngx-internal-lazy-loaded-${TBaseSelector}
   * @todo After TS 4.1 upgrade: `ngx-internal-lazy-loaded-${TBaseSelector}`
   */
  internalLazyLoadedComponent: string;
  /**
   * Actual selector referenced in DOM.
   * Would be: ngx-${TBaseSelector}
   * @todo After TS 4.1 upgrade: `ngx-${TBaseSelector}`
   */
  public: string;
}

export function ngxCreateSelectors<TSelector extends string>(
  baseSelector: TSelector
): NgxSelectors<TSelector> {
  return {
    lazyComponent: `ngx-lazy-component-${baseSelector}`,
    lazyLoadedComponent: `ngx-lazy-loaded-${baseSelector}`,
    internalLazyLoadedComponent: `ngx-internal-lazy-loaded-${baseSelector}`,
    public: `ngx-${baseSelector}`
  };
}

/**
 * @example ngxLazyComponentSelector`${mySelector}`
 */
export function ngxLazyComponentSelector<TSelector extends string>(
  strings: TemplateStringsArray,
  baseSelectorExp?: TSelector
): string {
  const selectors = ngxCreateSelectors<TSelector>(strings[0] as TSelector ?? baseSelectorExp);

  return selectors.lazyComponent;
}

/**
 * @example ngxLazyComponentSelector`${mySelector}`
 */
export function ngxLazyLoadedComponentSelector<TSelector extends string>(
  strings: TemplateStringsArray,
  baseSelectorExp?: TSelector
): string {
  const selectors = ngxCreateSelectors<TSelector>(strings[0] as TSelector ?? baseSelectorExp);

  return selectors.lazyLoadedComponent;
}

/**
 * @example ngxLazyComponentSelector`${mySelector}`
 */
export function ngxInternalLazyLoadedComponentSelector<TSelector extends string>(
  strings: TemplateStringsArray,
  baseSelectorExp?: TSelector
): string {
  const selectors = ngxCreateSelectors<TSelector>(strings[0] as TSelector ?? baseSelectorExp);

  return selectors.internalLazyLoadedComponent;
}

/**
 * @example ngxLazyComponentSelector`${mySelector}`
 */
export function ngxPublicSelector<TSelector extends string>(
  strings: TemplateStringsArray,
  baseSelectorExp?: TSelector
): string {
  const selectors = ngxCreateSelectors<TSelector>(strings[0] as TSelector ?? baseSelectorExp);

  return selectors.public;
}
