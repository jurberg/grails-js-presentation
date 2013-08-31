(function($) {
  
  // Full list of configuration options available here:
  // https://github.com/hakimel/reveal.js#configuration
  Reveal.initialize({
    controls: false,
    progress: true,
    history: true,
    center: true,
    theme: Reveal.getQueryHash().theme,
    transition: Reveal.getQueryHash().transition || 'default',
    dependencies: [
      { src: 'js/classList.js', 
        condition: function() { return !document.body.classList; } },
      { src: 'js/highlight.js', 
        async: true, callback: function() { hljs.initHighlightingOnLoad(); } },
      { src: 'js/zoom.js', 
        async: true, condition: function() { return !!document.body.classList; } },
      { src: 'js/notes.js', 
        async: true, condition: function() { return !!document.body.classList; } }
    ]
  });
 
})(jQuery);
