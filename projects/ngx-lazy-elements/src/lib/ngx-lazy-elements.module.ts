import {
  NgModule,
  SkipSelf,
  Optional,
  ModuleWithProviders
} from '@angular/core';
import { NgxLazyElementsService } from './ngx-lazy-elements.service';
import { NleDocumentService } from './document.service';
import { NleCustomElementService } from './custom-element.service';
import { NleMutationsService } from './mutations.service';

@NgModule({
  providers: [
    NgxLazyElementsService,
    NleDocumentService,
    NleCustomElementService,
    NleMutationsService
  ]
})
export class NgxLazyElementsModule {
  constructor(@Optional() @SkipSelf() parentModule: NgxLazyElementsModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only'
      );
    }
  }

  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: NgxLazyElementsModule
    };
  }
}
