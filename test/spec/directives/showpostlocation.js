'use strict';

describe('Directive: showPostLocation', function () {

  // load the directive's module
  beforeEach(module('artFinderApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<show-post-location></show-post-location>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the showPostLocation directive');
  }));
});
