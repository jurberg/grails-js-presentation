// An example Backbone application contributed by
// [Jérôme Gravel-Niquet](http://jgn.me/).
/*global $, window, AppView */
(function(AppView) {
  'use strict';

  // Load the application once the DOM is ready, using `jQuery.ready`:
  $(function() {

    // Finally, we kick things off by creating the **App**.
    window.App = new AppView();

  });

}(AppView));
