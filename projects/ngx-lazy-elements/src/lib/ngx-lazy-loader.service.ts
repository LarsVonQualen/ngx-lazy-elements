import {
  Compiler,
  Injectable,
  Injector,
  NgModuleFactory,
  Type
} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NgxLazyLoaderService {
  constructor(private injector: Injector, private compiler: Compiler) {}

  public async load(importer: () => Promise<Type<any>>) {
    const module = await importer();
    const factory = await this.loadModuleFactory(module);

    return factory.create(this.injector);
  }

  private async loadModuleFactory(t: Type<any>) {
    if (t instanceof NgModuleFactory) {
      return t;
    } else {
      return await this.compiler.compileModuleAsync(t);
    }
  }
}
