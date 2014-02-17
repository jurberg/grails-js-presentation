/*global require, _ */
/*jslint regexp: true */
(function() {
  'use strict';
  require.config({
    name: 'bootstrap',
    deps: ['spec/suite.spec'],
    baseUrl: '../../web-app/js',
    paths: {
      jquery: 'lib/jquery-1.7.1',
      underscore: 'lib/underscore',
      backbone: 'lib/backbone',
      spec: '../../test/spec'
    },
    shim: {
      backbone: {
        deps: ['underscore', 'jquery'],
        exports: 'Backbone'
      },
      underscore: {
        exports: "_",
        init: function () {
          this._.templateSettings = {
            interpolate : /\{\{(.+?)\}\}/g,
            evaluate : /\{!(.+?)!\}/g
          };
          return _; //this is what will be actually exported!
        }
      }
    }
  });
}());