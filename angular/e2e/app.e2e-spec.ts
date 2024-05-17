import { Event_Planning_SystemTemplatePage } from './app.po';

describe('Event_Planning_System App', function() {
  let page: Event_Planning_SystemTemplatePage;

  beforeEach(() => {
    page = new Event_Planning_SystemTemplatePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
