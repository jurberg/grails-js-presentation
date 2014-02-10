/*global require, jasmine */
require(['jquery', 'spec/collection/todo.spec', 'spec/model/todo.spec'], function($) {
  'use strict';
  $(function() {
    jasmine.getEnv().addReporter(new jasmine.TrivialReporter());
    jasmine.getEnv().addReporter(new jasmine.PhantomJSReporter());
    jasmine.getEnv().execute();
  });
});
