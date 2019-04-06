import { TestBed } from '@angular/core/testing';
import { NleCustomElementService } from './custom-element.service';
import { NgxLazyElementsService } from './ngx-lazy-elements.service';
import { NLE_WINDOW } from './nle-window.token';
import { CreateCustomElementFn } from './create-custom-element.token';

describe('NleCustomElementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const window = {
      customElements: {
        define: jasmine.createSpy('define')
      }
    };
    const createCustomElement = jasmine.createSpy('createCustomElement');
    const service = new NleCustomElementService(
      window as any,
      createCustomElement
    );

    expect(service).toBeTruthy();
  });

  it('should call define', () => {
    const window = {
      customElements: {
        define: jasmine.createSpy('define')
      }
    };
    const createCustomElement = () => null;
    const service = new NleCustomElementService(
      window as any,
      createCustomElement
    );

    service.createAndDefine('', null, null, null);

    expect(window.customElements.define).toHaveBeenCalled();
  });

  it('should call createCustomElement', () => {
    const window = {
      customElements: {
        define: () => {}
      }
    };
    const createCustomElement = jasmine.createSpy('createCustomElement');
    const service = new NleCustomElementService(
      window as any,
      createCustomElement
    );

    service.createAndDefine('', null, null, null);

    expect(createCustomElement).toHaveBeenCalled();
  });
});
