import { TestBed } from '@angular/core/testing';
import { NleDocumentService } from './document.service';
import { of, from } from 'rxjs';

describe('NleDocumentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service = new NleDocumentService({} as Window, null);
    expect(service).toBeTruthy();
  });

  it('should be able to read body inner html', () => {
    const innerHTML = '<my-tag></my-tag>';
    const service = new NleDocumentService(
      {
        document: { body: { innerHTML } }
      } as Window,
      null
    );

    expect(service.bodyHtml).toBe(innerHTML);
    expect(service.includes('my-tag')).toBeTruthy();
    expect(service.includes('my-other-tag')).toBeFalsy();
  });

  it('should be able to observe', done => {
    const innerHTML = '<my-tag></my-tag>';
    const el = document.createElement('my-tag');
    const mutations = ([
      {
        addedNodes: [el],
        type: 'childList'
      }
    ] as unknown[]) as MutationRecord[];
    const service = new NleDocumentService(
      {
        document: { body: { innerHTML } }
      } as Window,
      {
        mutationObserverFactory: null,
        observe(target: Node, childList = true, subtree = true) {
          return {
            mutations: from(mutations),
            unsubscribe() {}
          };
        }
      }
    );

    service.addedNodes.subscribe(m => {
      expect(m).toBe('my-tag');

      done();
    });

    service.setupObserver();
  });
});
