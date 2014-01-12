//Sample modified from PhantomJS 1.8.2 examples
var system = require('system');

/**
 * Wait until the test condition is true or a timeout occurs. Useful for waiting
 * on a server response or for a ui change (fadeIn, etc.) to occur.
 *
 * @param testFx javascript condition that evaluates to a boolean,
 * it can be passed in as a string (e.g.: "1 == 1" or "$('#bar').is(':visible')" or
 * as a callback function.
 * @param onReady what to do when testFx condition is fulfilled,
 * it can be passed in as a string (e.g.: "1 == 1" or "$('#bar').is(':visible')" or
 * as a callback function.
 * @param timeOutMillis the max amount of time to wait. If not specified, 3 sec is used.
 */
function waitFor(testFx, onReady, timeOutMillis) {
    var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 3001, //< Default Max Timeout is 3s
        start = new Date().getTime(),
        condition = false,
        interval = setInterval(function() {
            if ( (new Date().getTime() - start < maxtimeOutMillis) && !condition ) {
                // If not time-out yet and condition not yet fulfilled
                condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
            } else {
                if(!condition) {
                    // If condition still not fulfilled (timeout but condition is 'false')
                    console.log("'waitFor()' timeout");
                    phantom.exit(1);
                } else {
                    // Condition fulfilled (timeout and/or condition is 'true')
                    console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
                    typeof(onReady) === "string" ? eval(onReady) : onReady(); //< Do what it's supposed to do once the condition is fulfilled
                    clearInterval(interval); //< Stop this interval
                }
            }
        }, 100); //< repeat check every 100ms
};


if (system.args.length !== 2) {
    console.log('Usage: run-jasmine.js URL');
    phantom.exit(1);
}

var page = require('webpage').create();

// Route "console.log()" calls from within the Page context to the main Phantom context (i.e. current "this")
page.onConsoleMessage = function(msg) {
    console.log(msg);
};

var executed = false;
page.open(system.args[1], function(status) {

    // some versions of phantom will run the page open callback multiple times
    if (executed) {
        return;
    }
    executed = true;

    if (status !== "success") {
        console.log("Unable to access network");
        phantom.exit(1);
        return;
    }

    waitFor(function() {
        return page.evaluate(function() {
            var finished = document.body.querySelector('.finished-at');
            return (finished && finished.innerHTML.length > 0) ? true : false;
        });
    }, function() {
        var exitCode = page.evaluate(function() {
            console.log('');
            console.log(document.body.querySelector('.description').innerText);
            var list = document.body.querySelectorAll('.spec.failed');
            return (list && list.length > 0) ? 1 : 0;
        });
        page.evaluate(function() {
            jscoverage_report('phantom');
        });
        phantom.exit(exitCode);
    }, 120000);

});
