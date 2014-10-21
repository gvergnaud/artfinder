'use strict';

describe('Service: Locate', function () {

  // load the service's module
  beforeEach(module('artFinderApp'));

  // instantiate service
  var Locate;
  beforeEach(inject(function (_Locate_) {
    Locate = _Locate_;
  }));

  it('should do something', function () {
    expect(!!Locate).toBe(true);
  });

});
