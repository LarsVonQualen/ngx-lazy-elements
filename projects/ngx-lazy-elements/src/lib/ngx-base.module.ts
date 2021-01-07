import { Injector, Type } from '@angular/core';
import { NgxLazyElementsService } from './ngx-lazy-elements.service';

export class NgxBaseModule<TComponent> {
  constructor(
    public injector: Injector,
    public internalLazyLoadedComponentSelector: string,
    public component: Type<TComponent>
  ) {
    const ngxLazyElementsService = this.injector.get(NgxLazyElementsService);

    ngxLazyElementsService.registerImmediate(
      internalLazyLoadedComponentSelector,
      component
    );
  }
}
