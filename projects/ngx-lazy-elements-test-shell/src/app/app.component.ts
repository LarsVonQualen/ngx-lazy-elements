import { Component } from '@angular/core';
import { NgxLazyElementsService } from 'ngx-lazy-elements';
import { TestComponent } from './test.component';
import { Test1Component } from './test1.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ngx-lazy-elements-test-shell';

  public showLazy = false;

  constructor(ngxLazyElementsService: NgxLazyElementsService) {
    ngxLazyElementsService.registerImmediate('my-tag', TestComponent);
    ngxLazyElementsService.registerLazily('my-other-tag', Test1Component);

    setTimeout(() => (this.showLazy = true), 1000);
  }
}
