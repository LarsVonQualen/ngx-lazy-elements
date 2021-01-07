import { Injector, Type } from '@angular/core';
import { NgxLazyElementsService } from './ngx-lazy-elements.service';

export class NgxBaseLazyModule<TLazyComponent> {
  constructor(
    public injector: Injector,
    public publicSelector: string,
    public component: Type<TLazyComponent>
  ) {
    const ngxLazyElementsService = this.injector.get(NgxLazyElementsService);

    ngxLazyElementsService.registerLazily(publicSelector, component);
  }
}
