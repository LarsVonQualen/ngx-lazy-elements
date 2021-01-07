import { Inject, InjectionToken, Type } from '@angular/core';
import { NgxLazyElementsModule } from './ngx-lazy-elements.module';
import { NgxLazyLoaderService } from './ngx-lazy-loader.service';

export class NgxDynamicImportToken<TModule> extends InjectionToken<
  Promise<Type<TModule>>
> {
  constructor(
    public desc: string,
    public importer: () => Promise<Type<TModule>>
  ) {
    super(desc, {
      providedIn: 'root',
      factory: () => this.importer()
    });
  }
}

export abstract class NgxBaseLazyComponent<T> {
  constructor(public loader: NgxLazyLoaderService) {
    this.loader.load(() => this.importModule());
  }

  protected abstract importModule(): Promise<Type<T>>;
}
