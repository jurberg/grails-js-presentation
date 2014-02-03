/*global _ */
/*jslint regexp: true */
(function() {
  'use strict';
  _.templateSettings = {
    interpolate : /\{\{(.+?)\}\}/g,
    evaluate : /\{!(.+?)!\}/g
  };
}());
