'use strict';

/**
 * @ngdoc overview
 * @name artFinderApp
 * @description
 * # artFinderApp
 *
 * Main module of the application.
 */
var app = angular.module('artFinderApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'facebook'
    ], function($httpProvider) {
        // Use x-www-form-urlencoded Content-Type
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

        /**
         * The workhorse; converts an object to x-www-form-urlencoded serialization.
         * @param {Object} obj
         * @return {String}
         */ 
         var param = function(obj) {
          var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

          for(name in obj) {
              value = obj[name];

              if(value instanceof Array) {
                for(i=0; i<value.length; ++i) {
                  subValue = value[i];
                  fullSubName = name + '[' + i + ']';
                  innerObj = {};
                  innerObj[fullSubName] = subValue;
                  query += param(innerObj) + '&';
                }
              }
              else if(value instanceof Object) {
                for(subName in value) {
                  subValue = value[subName];
                  fullSubName = name + '[' + subName + ']';
                  innerObj = {};
                  innerObj[fullSubName] = subValue;
                  query += param(innerObj) + '&';
                }
              }
              else if(value !== undefined && value !== null){
                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
              }
          }

          return query.length ? query.substr(0, query.length - 1) : query;
        };

        // Override $http service's default transformRequest
        $httpProvider.defaults.transformRequest = [function(data) {
          return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
        }];
})
.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
      })
      .when('/search/:search', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
      })
      .when('/addpost', {
        templateUrl: 'views/addpost.html',
        controller: 'AddpostCtrl'
      })
      .when('/singlepost/:id', {
        templateUrl: 'views/singlepost.html',
        controller: 'SinglepostCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
})
.config(function(FacebookProvider) {
     // Set your appId through the setAppId method or
     // use the shortcut in the initialize method directly.
     FacebookProvider.init('306208576247087');
})
.constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized',
    userLocationChanged: 'user-location-changed'
})
.constant('USER_ROLES', {
    all: '*',
    admin: 'admin',
    editor: 'editor',
    guest: 'guest'
})
.constant('SERVER', {
    url: 'http://artfinder.gabrielvergnaud.com/',
    nodeServerUrl: 'https://artfindersocket.herokuapp.com/'
});