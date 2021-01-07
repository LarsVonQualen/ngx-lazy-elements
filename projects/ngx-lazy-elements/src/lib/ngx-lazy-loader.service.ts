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
    try {
      const module = await importer();
      const factory = await this.loadModuleFactory(module);

      return factory.create(this.injector);
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  private async loadModuleFactory(t: Type<any>) {
    try {
      if (t instanceof NgModuleFactory) {
        return t;
      } else {
        return await this.compiler.compileModuleAsync(t);
      }
    } catch (error) {
      console.error(error);

      throw error;
    }
  }
}
