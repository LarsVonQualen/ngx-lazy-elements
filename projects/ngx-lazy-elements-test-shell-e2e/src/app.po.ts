import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get(browser.baseUrl) as Promise<any>;
  }

  getTitleText() {
    return element(by.css('app-root h1')).getText() as Promise<string>;
  }

  getMyTag() {
    return element(by.css('my-tag')).getText() as Promise<string>;
  }

  getMyOtherTag() {
    return new Promise<string>(resolve =>
      setTimeout(() => element(by.css('my-tag')).getText(), 10000)
    );
  }
}
