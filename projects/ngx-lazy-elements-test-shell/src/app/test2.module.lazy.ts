import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Injector,
  NgModule,
  Type
} from '@angular/core';
import {
  NgxBaseLazyComponent,
  NgxBaseLazyModule,
  NgxLazyLoaderService
} from 'ngx-lazy-elements';
import { Test2Module } from './test2.module';

export const TEST2_SELECTOR = 'test2';

@Component({
  selector: `ngx-lazy-component-${TEST2_SELECTOR}`,
  template: `<ngx-lazy-loaded-${TEST2_SELECTOR}></ngx-lazy-loaded-${TEST2_SELECTOR}>`
})
export class Test2LazyComponent extends NgxBaseLazyComponent<Test2Module> {
  constructor(public loader: NgxLazyLoaderService) {
    super(loader);
  }

  protected async importModule(): Promise<Type<Test2Module>> {
    const m = await import('./test2.module');

    return m.Test2Module;
  }
}

@NgModule({
  declarations: [Test2LazyComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Test2LazyModule extends NgxBaseLazyModule<Test2LazyComponent> {
  constructor(public injector: Injector) {
    super(injector, `ngx-${TEST2_SELECTOR}`, Test2LazyComponent);
  }
}
