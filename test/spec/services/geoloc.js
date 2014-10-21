'use strict';

describe('Service: Geoloc', function () {

  // load the service's module
  beforeEach(module('artFinderApp'));

  // instantiate service
  var Geoloc;
  beforeEach(inject(function (_Geoloc_) {
    Geoloc = _Geoloc_;
  }));

  it('should do something', function () {
    expect(!!Geoloc).toBe(true);
  });

});
