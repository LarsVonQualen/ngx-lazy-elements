import { InjectionToken } from '@angular/core';

export type MutationObserverFactory = (
  cb: MutationCallback
) => MutationObserver;

export const NLE_MUTATION_OBSERVER_FACTORY = new InjectionToken(
  'NLE_MUTATION_OBSERVER_FACTORY',
  {
    providedIn: 'root',
    factory: () => (cb: MutationCallback) =>
      new MutationObserver((m, o) => cb(m, o))
  }
);
