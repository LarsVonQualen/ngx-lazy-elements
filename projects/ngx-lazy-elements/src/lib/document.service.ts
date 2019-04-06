import { Injectable, Inject } from '@angular/core';
import { NLE_WINDOW, NleWindow } from './nle-window.token';
import { Subject } from 'rxjs';
import { filter, mergeMap, map, tap } from 'rxjs/operators';
import { NleMutationsService } from './mutations.service';

@Injectable({
  providedIn: 'root'
})
export class NleDocumentService {
  private addedNode$ = new Subject<string>();
  private internalBodyHtml = '';
  private internalStopObserving: () => void = undefined;

  public get bodyHtml() {
    if (!this.internalBodyHtml) {
      this.internalBodyHtml = this.getBodyInnerHtml();
    }

    return this.internalBodyHtml;
  }

  public get addedNodes() {
    return this.addedNode$.asObservable();
  }

  constructor(
    @Inject(NLE_WINDOW) private win: NleWindow,
    private mutationsService: NleMutationsService
  ) {}

  public includes(name: string) {
    const inBody = this.bodyHtml.includes(`<${name.toLowerCase()}`);

    return inBody;
  }

  public stopObserver() {
    if (this.internalStopObserving) {
      this.internalStopObserving();
    }
  }

  public setupObserver() {
    if (this.internalStopObserving) {
      console.warn('[ngx-lazy-element] document observer already setup');
      return;
    }

    const { mutations, unsubscribe } = this.mutationsService.observe(
      this.win.document
    );

    const sub = mutations
      .pipe(
        filter(m => m.type === 'childList'),
        mergeMap(m => m.addedNodes),
        filter(target => target instanceof HTMLElement),
        map(target => target as HTMLElement),
        mergeMap(target => this.findAllTagNames(target)),
        map(tagName => tagName.toLowerCase()),
        tap(() => (this.internalBodyHtml = ''))
      )
      .subscribe(
        tag => this.addedNode$.next(tag),
        err => console.error('[ngx-lazy-element]', err)
      );

    this.internalStopObserving = () => {
      sub.unsubscribe();
      unsubscribe();
    };
  }

  private getBodyInnerHtml() {
    if (
      !this.win ||
      !this.win.document ||
      !this.win.document.body ||
      !this.win.document.body.innerHTML
    ) {
      return '';
    }

    return this.win.document.body.innerHTML.toLowerCase();
  }

  private findAllTagNames(element: Element) {
    const tagNames = [element.tagName];

    if (element.children.length > 0) {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < element.children.length; i++) {
        const current = element.children[i];

        tagNames.push(current.tagName);

        if (current.children.length > 0) {
          tagNames.push(...this.findAllTagNames(current));
        }
      }
    }

    return tagNames.filter(t => !!t);
  }
}
