import { IpGraphPage } from './app.po';

describe('ip-graph App', function() {
  let page: IpGraphPage;

  beforeEach(() => {
    page = new IpGraphPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
