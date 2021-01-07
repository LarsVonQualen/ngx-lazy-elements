import { Inject, Injectable, Injector, Type } from '@angular/core';
import { NgElementStrategyFactory } from '@angular/elements';
import { ElementZoneStrategyFactory } from 'elements-zone-strategy';
import { filter, map } from 'rxjs/operators';
import { NleCustomElementService } from './custom-element.service';
import { NleDocumentService } from './document.service';
import { NLE_WINDOW, NleWindow } from './nle-window.token';
import { ElementItem } from './element-item.interface';

@Injectable({
  providedIn: 'root'
})
export class NgxLazyElementsService {
  private registry = {
    live: new Set<string>(),
    dead: new Set<string>()
  };
  private elementCache = new Map<string, ElementItem>();

  constructor(
    private globalInjector: Injector,
    @Inject(NLE_WINDOW) public w: NleWindow,
    private document: NleDocumentService,
    private customElementService: NleCustomElementService
  ) {}

  /**
   * Sets up a MutationObserver on the document and starts looking out for added
   * nodes that match elements in our registry not yet registered.
   */
  public startObservingDOM() {
    this.w.__ngx_elements = this.registry;
    this.document.addedNodes
      .pipe(
        filter(tag => this.elementCache.has(tag)),
        map(tag => this.elementCache.get(tag))
      )
      .subscribe(
        ({ name, component, injector }) => {
          this.createElement({ name, component, injector }, injector);

          if (this.registry.dead.has(name)) {
            this.registry.dead.delete(name);
          }
        },
        err => console.error('[ngx-lazy-element]', err)
      );

    this.document.setupObserver();
  }

  /**
   * Stops the MutationObserver on the DOM
   */
  public stopObservingDOM() {
    this.document.stopObserver();
  }

  /**
   * This method will first try and look into the body of the HTML in order to
   * determine if we should defer registration of the component or not. If we
   * find a tag matching the custom element, we will register it immediately.
   * If we do this, we will be able to ship a bundle with all components, but
   * only in fact use the ones we have in DOM at any given moment.
   * If the we do not find a matching tag, we will cache the element and wait
   * for the body to mutate and present us with a match before we register. In
   * order for that to work please call .startObservingDOM() as soon
   * as possible
   *
   * @param customElementTag Tag of the custom element
   * @param component Corresponding Angular component
   * @param localInjector Local injector is just passed through
   */
  public registerLazily(
    customElementTag: string,
    component: Type<any>,
    localInjector?: Injector
  ) {
    if (this.registry.live.has(customElementTag)) {
      console.warn(
        // tslint:disable-next-line:max-line-length
        `[ngx-lazy-element] Component '${customElementTag}' is already registered, probably because module was loaded twice, falling back to doing nothing`
      );

      return;
    }

    if (this.document.includes(customElementTag)) {
      this.createElement(
        {
          name: customElementTag,
          component,
          injector: localInjector || this.globalInjector
        },
        localInjector || this.globalInjector
      );
    } else {
      this.elementCache.set(customElementTag, {
        name: customElementTag,
        component,
        injector: localInjector || this.globalInjector
      });
      this.registry.dead.add(customElementTag);
    }
  }

  /**
   * With this method we can try and register a custom element immediately.
   * Sometimes though, it is desired to defer the registraion, because some
   * browsers can be quite slow because they use polyfills.
   *
   * @param customElementTag Tag of the custom element
   * @param component Corresponding Angular component
   * @param localInjector Local injector is just passed through
   */
  public registerImmediate(
    customElementTag: string,
    component: Type<any>,
    localInjector?: Injector
  ) {
    if (this.registry.live.has(customElementTag)) {
      console.warn(
        // tslint:disable-next-line:max-line-length
        `[ngx-lazy-element] Component '${customElementTag}' is already registered, probably because module was loaded twice, falling back to doing nothing`
      );

      return;
    }

    this.createElement(
      {
        name: customElementTag,
        component,
        injector: localInjector || this.globalInjector
      },
      localInjector || this.globalInjector
    );
  }

  /**
   * Combines .getStrategy() and .createCustomElement() and maintains the local
   * element registry.
   *
   * @param item Tuple of name and component in question
   * @param localInjector Local injector is just passed through
   */
  private createElement(item: ElementItem, localInjector?: Injector) {
    requestAnimationFrame(() => {
      try {
        const { name, component } = item;

        if (this.registry.live.has(name)) {
          console.warn(
            // tslint:disable-next-line:max-line-length
            `[ngx-lazy-element] Component '${name}' is already registered, probably because module was loaded twice, falling back to doing nothing`
          );
        } else {
          const strategyFactory = this.getStrategy(
            name,
            component,
            localInjector
          );

          this.createCustomElement(
            name,
            component,
            strategyFactory,
            localInjector
          );

          this.registry.live.add(name);
        }
      } catch (error) {
        console.error(`[ngx-lazy-element] Unable to register: ${name}`, error);
      }
    });
  }

  /**
   * This is where we actually create the custom element in DOM.
   * If a local injector is not provided we fall back to the globally injected.
   *
   * @param customElementTag Name of the custom element
   * @param component The Angular component we want to create as custom element
   * @param strategyFactory Strategy created with .getStrategy()
   * @param localInjector Local injector if it was passed down
   */
  private createCustomElement(
    customElementTag: string,
    component: Type<any>,
    strategyFactory: NgElementStrategyFactory,
    localInjector?: Injector
  ) {
    if (localInjector) {
      try {
        this.customElementService.createAndDefine(
          customElementTag,
          component,
          strategyFactory,
          localInjector
        );

        return;
      } catch (e) {
        console.warn(
          // tslint:disable-next-line:max-line-length
          `[ngx-lazy-element] Unable to create custom element for '${customElementTag}' using local injector, falling back to global injector.`
        );
      }
    }

    try {
      this.customElementService.createAndDefine(
        customElementTag,
        component,
        strategyFactory,
        this.globalInjector
      );
    } catch (e) {
      throw e;
    }
  }

  /**
   * At the moment we need to use a custom zone strategy with custom elements.
   * If a local injector is not provided we fall back to the globally injected.
   *
   * @param customElementTag Name of the custom element
   * @param component Component we want to get zone stategy for
   * @param localInjector Local injector if it was passed down
   */
  private getStrategy(
    customElementTag: string,
    component: Type<any>,
    localInjector?: Injector
  ) {
    if (localInjector) {
      try {
        return new ElementZoneStrategyFactory(component, localInjector);
      } catch (e) {
        console.warn(
          // tslint:disable-next-line:max-line-length
          `[ngx-lazy-element] Unable to create ElementZoneStrategy for '${customElementTag}' using local injector, falling back to global injector.`
        );
      }
    }

    try {
      return new ElementZoneStrategyFactory(component, this.globalInjector);
    } catch (e) {
      throw e;
    }
  }
}
