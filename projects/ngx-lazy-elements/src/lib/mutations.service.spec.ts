import { TestBed } from '@angular/core/testing';
import { NleDocumentService } from './document.service';
import { NgxLazyElementsService } from './ngx-lazy-elements.service';
import { NleMutationsService } from './mutations.service';
import { Subject } from 'rxjs';

describe('NleMutationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service = new NleMutationsService(
      () => new MutationObserver(() => {})
    );
    expect(service).toBeTruthy();
  });

  it('should be able to observe', done => {
    const emitCb = new Subject();
    let emitCbSub;

    const service = new NleMutationsService((cb: MutationCallback) => {
      return {
        disconnect() {},
        observe(target: Node, options?: MutationObserverInit) {
          emitCbSub = emitCb.subscribe(() => cb([null], null));
        },
        takeRecords() {
          return [];
        }
      };
    });

    const { mutations, unsubscribe } = service.observe(null, true, true);

    const sub = mutations.subscribe(
      m => {
        expect(true).toBeTruthy();
        sub.unsubscribe();
        unsubscribe();
        emitCbSub.unsubscribe();
        done();
      },
      () => {
        expect(true).toBeFalsy();
        sub.unsubscribe();
        unsubscribe();
        emitCbSub.unsubscribe();
        done();
      }
    );

    emitCb.next();
  });
});
