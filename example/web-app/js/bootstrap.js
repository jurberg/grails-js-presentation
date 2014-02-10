var deps = deps || ['main'];
var baseUrl = baseUrl || 'js';

/*global require, _ */
/*jslint regexp: false*/
(function() {
  'use strict';
  require.config({
    deps: deps,
    baseUrl: baseUrl,
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