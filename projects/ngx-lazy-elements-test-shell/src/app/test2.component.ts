import { Component } from '@angular/core';
import { TEST2_SELECTOR } from './test2.module.lazy';

@Component({
  selector: `ngx-internal-lazy-loaded-${TEST2_SELECTOR}`,
  template: 'test2-component'
})
export class Test2Component {}
