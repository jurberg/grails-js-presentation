var htmlrunner,
    resultdir,
    page,
    fs;

phantom.injectJs("utils/core.js");

if (phantom.args.length !== 2) {
    console.log("Usage: phantom_test_runner.js HTML_RUNNER RESULT_DIR");
    phantom.exit();
} else {
    htmlrunner = phantom.args[0];
    resultdir = phantom.args[1];
    page = require("webpage").create();
    fs = require("fs");
    
    // Echo the output of the tests to the Standard Output
    page.onConsoleMessage = function(msg, source, linenumber) {
        console.log(msg);
    };

    page.open(htmlrunner, function(status) {
        if (status === "success") {
            utils.core.waitfor(function() { // wait for this to be true
                return page.evaluate(function() {
                    return typeof(jasmine.phantomjsXMLReporterPassed) !== "undefined";
                });
            }, function() { // once done...

                // Retrieve the result of the tests
                var f = null, i, len, rc = 1, message;

                try {

                    suitesResults = page.evaluate(function() {
                        return jasmine.phantomjsXMLReporterResults;
                    });

                    // save off the page for diagnostic purposes
                    page.render(resultdir + '/jasmine-page.png');

                    // Save the result of the tests in files
                    for (i = 0, len = suitesResults.length; i < len; ++i) {
                        try {
                            f = fs.open(resultdir + '/' + suitesResults[i]["xmlfilename"], "w");
                            f.write(suitesResults[i]["xmlbody"]);
                            f.close();
                        } catch (e) {
                            console.log(e);
                            console.log("phantomjs> Unable to save result of Suite '"+ suitesResults[i]["xmlfilename"] +"'");
                        }
                    }

                    message = page.evaluate(function() {
                        var env = jasmine.getEnv(),
                            runner = env ? env.currentRunner() : null,
                            results = runner ? runner.results() : null;
                        return results ? '' : 'Jasmine results not found on page.  Cannot determine results.';
                    });

                    if (message) {
                        throw message;
                    }

                    // exit(0) is success, exit(1) is failure
                    rc = page.evaluate(function() {
                        return jasmine.getEnv().currentRunner().results().failedCount > 0 ? 1 : 0;
                    });

                } catch (e) {
                    console.log(e);
                }

                // Return the correct exit status. '0' only if all the tests passed
                phantom.exit(rc);

            }, function() { // or, once it timesout...
                console.log("phantomjs> waitFor timed out");
                phantom.exit(1);
            }, 120000);
        } else {
            console.log("phantomjs> Could not load '" + htmlrunner + "'.");
            phantom.exit(1);
        }
    });
}
