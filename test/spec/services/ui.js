'use strict';

describe('Service: UI', function () {

  // load the service's module
  beforeEach(module('artFinderApp'));

  // instantiate service
  var UI;
  beforeEach(inject(function (_UI_) {
    UI = _UI_;
  }));

  it('should do something', function () {
    expect(!!UI).toBe(true);
  });

});
