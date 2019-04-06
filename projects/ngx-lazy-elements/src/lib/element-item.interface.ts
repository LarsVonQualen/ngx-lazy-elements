import { Type, Injector } from '@angular/core';

export interface ElementItem {
  name: string;
  component: Type<any>;
  injector: Injector;
}
