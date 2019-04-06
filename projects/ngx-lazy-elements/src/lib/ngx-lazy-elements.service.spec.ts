import { TestBed } from '@angular/core/testing';

import { NgxLazyElementsService } from './ngx-lazy-elements.service';
import { NleDocumentService } from './document.service';
import { of, Subject } from 'rxjs';
import { NleCustomElementService } from './custom-element.service';
import { Component, NgModule, Injector } from '@angular/core';

@Component({
  selector: 'lib-my-tag',
  template: ''
})
export class TestComponent {}

@NgModule({
  declarations: [TestComponent],
  entryComponents: [TestComponent],
  exports: [TestComponent]
})
export class TestModule {}

describe('NgxLazyElementsService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [TestModule]
    })
  );

  it('should be created', () => {
    const service: NgxLazyElementsService = TestBed.get(NgxLazyElementsService);
    expect(service).toBeTruthy();
  });

  it('should be able to stop observing', () => {
    const documentServiceMock = {
      stopObserver: jasmine.createSpy()
    };
    TestBed.overrideProvider(NleDocumentService, {
      useValue: documentServiceMock
    });
    const service: NgxLazyElementsService = TestBed.get(NgxLazyElementsService);
    service.stopObservingDOM();

    expect(documentServiceMock.stopObserver).toHaveBeenCalled();
  });

  it('should be able to start observing', () => {
    const documentServiceMock = {
      setupObserver: jasmine.createSpy(),
      addedNodes: of([])
    };
    const customElementServiceMock = {
      createAndDefine: jasmine.createSpy()
    };
    TestBed.overrideProvider(NleDocumentService, {
      useValue: documentServiceMock
    });
    TestBed.overrideProvider(NleCustomElementService, {
      useValue: customElementServiceMock
    });
    const service: NgxLazyElementsService = TestBed.get(NgxLazyElementsService);
    service.startObservingDOM();

    expect(documentServiceMock.setupObserver).toHaveBeenCalled();
    expect(customElementServiceMock.createAndDefine).not.toHaveBeenCalled();
  });

  it('should be able to start observing', () => {
    const addNodes = new Subject<string>();
    const documentServiceMock = {
      setupObserver: jasmine.createSpy(),
      addedNodes: addNodes.asObservable()
    };
    const customElementServiceMock = {
      createAndDefine: jasmine.createSpy()
    };
    TestBed.overrideProvider(NleDocumentService, {
      useValue: documentServiceMock
    });
    TestBed.overrideProvider(NleCustomElementService, {
      useValue: customElementServiceMock
    });
    const service: NgxLazyElementsService = TestBed.get(NgxLazyElementsService);
    service.startObservingDOM();

    expect(documentServiceMock.setupObserver).toHaveBeenCalled();
    expect(customElementServiceMock.createAndDefine).not.toHaveBeenCalled();
  });

  it('it should be possible to immidiately create elements', () => {
    const addNodes = new Subject<string>();
    const documentServiceMock = {
      setupObserver: jasmine.createSpy(),
      addedNodes: addNodes.asObservable(),
      includes: () => false
    };
    const customElementServiceMock = {
      createAndDefine: () => {}
    };
    TestBed.overrideProvider(NleDocumentService, {
      useValue: documentServiceMock
    });
    TestBed.overrideProvider(NleCustomElementService, {
      useValue: customElementServiceMock
    });
    const service: NgxLazyElementsService = TestBed.get(NgxLazyElementsService);
    service.startObservingDOM();

    service.registerImmediate('my-tag', TestComponent, TestBed.get(Injector));

    expect(true).toBeTruthy();
  });

  it('it should be possible to immidiately create elements twice', () => {
    const addNodes = new Subject<string>();
    const documentServiceMock = {
      setupObserver: jasmine.createSpy(),
      addedNodes: addNodes.asObservable(),
      includes: () => false
    };
    const customElementServiceMock = {
      createAndDefine: () => {}
    };
    TestBed.overrideProvider(NleDocumentService, {
      useValue: documentServiceMock
    });
    TestBed.overrideProvider(NleCustomElementService, {
      useValue: customElementServiceMock
    });
    const service: NgxLazyElementsService = TestBed.get(NgxLazyElementsService);
    service.startObservingDOM();

    service.registerImmediate('my-tag', TestComponent, TestBed.get(Injector));
    service.registerImmediate('my-tag', TestComponent, TestBed.get(Injector));

    expect(true).toBeTruthy();
  });

  it('it should be possible to lazily create elements', () => {
    const addNodes = new Subject<string>();
    const documentServiceMock = {
      setupObserver: jasmine.createSpy(),
      addedNodes: addNodes.asObservable(),
      includes: () => false
    };
    const customElementServiceMock = {
      createAndDefine: () => {}
    };
    TestBed.overrideProvider(NleDocumentService, {
      useValue: documentServiceMock
    });
    TestBed.overrideProvider(NleCustomElementService, {
      useValue: customElementServiceMock
    });
    const service: NgxLazyElementsService = TestBed.get(NgxLazyElementsService);
    service.startObservingDOM();

    service.registerLazily('my-tag', TestComponent, TestBed.get(Injector));

    addNodes.next('my-tag');

    expect(true).toBeTruthy();
  });

  it('it should be possible to lazily create elements immidiate if already in body', () => {
    const addNodes = new Subject<string>();
    const documentServiceMock = {
      setupObserver: jasmine.createSpy(),
      addedNodes: addNodes.asObservable(),
      includes: () => true
    };
    const customElementServiceMock = {
      createAndDefine: () => {}
    };
    TestBed.overrideProvider(NleDocumentService, {
      useValue: documentServiceMock
    });
    TestBed.overrideProvider(NleCustomElementService, {
      useValue: customElementServiceMock
    });
    const service: NgxLazyElementsService = TestBed.get(NgxLazyElementsService);
    service.startObservingDOM();

    service.registerLazily('my-tag', TestComponent, TestBed.get(Injector));

    addNodes.next('my-tag');

    expect(true).toBeTruthy();
  });
});
