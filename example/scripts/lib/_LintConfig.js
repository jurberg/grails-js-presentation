var config = {
    verbose          : false,
    stopOnFirstError : false,
    logFile          : 'target/test-reports/jslint-errors.log',

    // recursively include JS files in these folders
    filepaths  : [ {filepaths} ],

    //but ignore anything in these folders
    exclusions : [ {exclusions} ],

    jsLint : {
        file   : 'jslint.js',
        optons : {}
    },

    //optionally disable a linter
    jsHint : false
};

phantom.injectJs('PhantomLint.js');
PhantomLint.init(config);