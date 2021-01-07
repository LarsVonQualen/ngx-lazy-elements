# ngx-lazy-elements

Library that helps you manage lazy Angular Elements Web Components

## Installation

`npm i --save ngx-lazy-elements`

### Dependencies

Using web components in production requires polyfills:

- `elements-zone-strategy`
- `@angular/elements`
- `document-register-element`
- `@webcomponents/webcomponentsjs`

For more information follow the guide here: [https://lvq.dk/blog/complete-angular-elements-example.html](https://lvq.dk/blog/complete-angular-elements-example.html)

## Usage

For instance import in root app module and make sure to use `.forRoot()`. The service relies on a shared state, therefor it needs to be imported only once and be provided in 'root'.

Methods to look out for `.startObservingDOM()`, `.registerImmediate()` and `.registerLazily()`.

In order to make sure your application runs smoothly, make sure to only use `.registerImmediate()` for components available at initial load. If you know that a component will be created dynamically, then use `.registerLazily()`, that will only register when a tag is present in DOM.

## Example

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { NgxLazyElementsModule, NgxLazyElementsService } from 'ngx-lazy-elements';
import { YourAwesomeComponent } from './your-awesome.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgxLazyElementsModule.forRoot();
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(public ngxLazyElementsService: NgxLazyElementsService) {
    ngxLazyElementsService.startObservingDOM();

    ngxLazyElementsService.registerImmediate('my-tag', YourAwesomeComponent);
    ngxLazyElementsService.registerLazily('my-other-tag', YourAwesomeComponent);
  }
}
```
