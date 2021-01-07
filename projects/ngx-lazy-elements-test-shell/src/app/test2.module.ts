import { Injector, NgModule } from '@angular/core';
import { NgxBaseModule } from 'ngx-lazy-elements';
import { Test2Component } from './test2.component';
import { TEST2_SELECTOR } from './test2.module.lazy';

@NgModule({
  declarations: [Test2Component]
})
export class Test2Module extends NgxBaseModule<Test2Component> {
  constructor(public injector: Injector) {
    super(injector, `ngx-lazy-loaded-${TEST2_SELECTOR}`, Test2Component);
  }
}
