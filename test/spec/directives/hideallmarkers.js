'use strict';

describe('Directive: hideAllMarkers', function () {

  // load the directive's module
  beforeEach(module('artFinderApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<hide-all-markers></hide-all-markers>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the hideAllMarkers directive');
  }));
});
