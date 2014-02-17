/*global require, _ */
/*jslint regexp: true */
(function() {
  'use strict';
  require.config({
    name: 'bootstrap',
    deps: ['main'],
    baseUrl: 'js',
    paths: {
      jquery: 'lib/jquery-1.7.1',
      underscore: 'lib/underscore',
      backbone: 'lib/backbone'
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