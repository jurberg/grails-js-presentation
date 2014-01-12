var config = {
    verbose          : false,
    stopOnFirstError : false,
    logFile          : 'target/test-reports/jslint-errors.log',

    // recursively include JS files in these folders
    filepaths  : [ 'web-app/js/','test/spec/' ],

    //but ignore anything in these folders
    exclusions : [ 'web-app/js/lib/','test/spec/lib/' ],

    jsLint : {
        file   : 'jslint.js',
        optons : {}
    },

    //optionally disable a linter
    jsHint : false
};

phantom.injectJs('PhantomLint.js');
PhantomLint.init(config);