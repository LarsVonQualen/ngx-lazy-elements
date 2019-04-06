import { Inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {
  MutationObserverFactory,
  NLE_MUTATION_OBSERVER_FACTORY
} from './mutation-oberver-factory.token';

@Injectable({
  providedIn: 'root'
})
export class NleMutationsService {
  constructor(
    @Inject(NLE_MUTATION_OBSERVER_FACTORY)
    public mutationObserverFactory: MutationObserverFactory
  ) {}

  public observe(target: Node, childList = true, subtree = true) {
    const mutations = new Subject<MutationRecord>();
    const observer = this.mutationObserverFactory(m =>
      m.forEach(record => mutations.next(record))
    );

    observer.observe(target, { childList, subtree });

    return {
      mutations: mutations.asObservable(),
      unsubscribe: () => {
        observer.disconnect();
        mutations.complete();
      }
    };
  }
}
