import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppComponent } from './app.component';
import {
  NgxLazyElementsModule,
  NgxLazyElementsService
} from 'ngx-lazy-elements';
import { Test1Component } from './test1.component';
import { TestComponent } from './test.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [AppComponent, TestComponent, Test1Component],
  entryComponents: [TestComponent, Test1Component],
  imports: [BrowserModule, NgxLazyElementsModule.forRoot(), CommonModule],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
  constructor(ngxLazyElementsService: NgxLazyElementsService) {
    ngxLazyElementsService.startObservingDOM();
  }
}
