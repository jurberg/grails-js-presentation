/*global define */
define(['backbone'], function(Backbone) {
  'use strict';

  var counter = 1;

  // Todo Model
  // ----------

  // Our basic **Todo** model has `text`, `order`, and `done` attributes.
  var Todo = Backbone.Model.extend({

    // Default attributes for a todo item.
    defaults: function() {
      return {
        done:  false,
        order: counter++ //Todos.nextOrder()
      };
    },

    // Toggle the `done` state of this todo item.
    toggle: function() {
      this.save({done: !this.get("done")});
    }

  });

  return Todo;

});
