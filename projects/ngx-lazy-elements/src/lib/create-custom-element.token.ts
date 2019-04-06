import {
  createCustomElement,
  NgElementStrategyFactory,
  NgElementConfig,
  NgElementConstructor
} from '@angular/elements';
import { InjectionToken, Type } from '@angular/core';

export type CreateCustomElementFn = <P>(
  component: Type<any>,
  config: NgElementConfig
) => NgElementConstructor<P>;

export const NLE_CREATE_CUSTOM_ELEMENT = new InjectionToken(
  'NLE_CREATE_CUSTOM_ELEMENT',
  {
    providedIn: 'root',
    factory: () => {
      return <P>(component: Type<any>, config: NgElementConfig) =>
        createCustomElement<P>(component, config);
    }
  }
);
