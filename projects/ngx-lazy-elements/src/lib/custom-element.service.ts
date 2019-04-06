import { Injectable, Inject, Type, Injector } from '@angular/core';
import { NgElementStrategyFactory } from '@angular/elements';
import { NLE_WINDOW, NleWindow } from './nle-window.token';
import {
  NLE_CREATE_CUSTOM_ELEMENT,
  CreateCustomElementFn
} from './create-custom-element.token';

@Injectable({
  providedIn: 'root'
})
export class NleCustomElementService {
  constructor(
    @Inject(NLE_WINDOW) private win: NleWindow,
    @Inject(NLE_CREATE_CUSTOM_ELEMENT)
    private createCustomElement: CreateCustomElementFn
  ) {}

  public createAndDefine(
    customElementTag: string,
    component: Type<any>,
    strategyFactory: NgElementStrategyFactory,
    injector: Injector
  ) {
    const el = this.createCustomElement(component, {
      injector,
      strategyFactory
    });
    this.win.customElements.define(customElementTag, el);
  }
}
