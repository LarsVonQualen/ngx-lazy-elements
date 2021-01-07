import { InjectionToken } from '@angular/core';

// tslint:disable-next-line:no-empty-interface
export interface NleWindow extends Window {
  __ngx_elements: {
    live: Set<string>;
    dead: Set<string>;
  };
}

export const NLE_WINDOW = new InjectionToken('NLE_WINDOW', {
  providedIn: 'root',
  factory: () => (window as unknown) as NleWindow
});
