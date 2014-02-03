/*
 Copyright (c) 2011 Arthur Kay

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is furnished
 to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

var filesystem = require('fs'),
    JSLINT, JSHINT;

/**
 * @class PhantomLint
 * @author Arthur Kay (http://www.akawebdesign.com)
 * @singleton
 * @version 1.3.0
 *
 * GitHub Project: https://github.com/arthurakay/PhantomLint
 */
PhantomLint = {
    /**
     * @cfg {Array} filepaths
     * REQUIRED. An array of relative filepaths to the folders containing JS files
     */

    /**
     * @cfg {Array} exclusions
     * REQUIRED. An array of relative filepaths to the folders containing JS files that should NOT be linted
     */

    /**
     * @cfg verbose
     * True to show verbose ouput in the terminal.
     */
    verbose : true,

    /**
     * @cfg stopOnFirstError
     * True to stop linting your code when the first error is encountered.
     */
    stopOnFirstError : true,

    /**
     * @cfg jsLint
     * An object containing "file" and "options" properties (False to disable usage.).
     *
     *   - "file" is a relative filepath to the local JSLint file to use (defaults to ./assets/jslint.js).
     *   - "options" is an object containing the optional lint flags.
     */
    jsLint : {
        file : 'jslint.js',

        options : {
            nomen    : true, //if names may have dangling _
            plusplus : true, //if increment/decrement should be allowed
            vars     : true, //if multiple var statements per function should be allowed
            white    : true //if sloppy whitespace is tolerated
        }
    },

    /**
     * @cfg jsHint
     * An object containing "file" and "options" properties (False to disable usage.).
     *
     *   - "file" is a relative filepath to the local JSHint file to use (defaults to ./assets/jshint-master/src/stable/jshint.js).
     *   - "options" is an object containing the optional lint flags.
     *
     */
    jsHint : {
        file : 'assets/jshint-master/src/stable/jshint.js',

        options : {

        }
    },

    /**
     * @cfg logFile
     * A relative filepath to where error messages will be logged.
     */
    logFile : 'error_log.txt',


    /**
     * Call this method to de-lint your JavaScript codebase.
     */
    init : function (config) {
        //APPLY CONFIG OPTIONS
        this.initConfigs(config);

        if (this.jsLint) {
            this.log('Loading JSLint... ' + phantom.injectJs(this.jsLint.file), true);
            this.linters.push(JSLINT);
        }

        if (this.jsHint) {
            this.log('Loading JSHint... ' + phantom.injectJs(this.jsHint.file), true);
            this.linters.push(JSHINT);
        }

        if (!JSLINT && !JSHINT) {
            phantom.exit(1);
        }

        this.parseTree(config.filepaths);
        this.log('\nFilesystem has been parsed. Looping through available files...');

        if (this.lintFiles()) {
            this.announceSuccess();
        }
    },


    /**
     * @private
     */
    files : [],

    /**
     * @private
     */
    linters : [],


    /**
     * @private
     */
    initConfigs : function (config) {
        var i;

        if (!config) {
            return false;
        }

        for (i in config) {
            if (config.hasOwnProperty(i)) {
                switch (i) {
                    case 'jsLint':
                    case 'jsHint':
                        if (typeof config[i] !== 'boolean') {
                            this.applyLintOptions(this[i], config.options);
                            break;
                        }

                        this[i] = config[i];
                        break;

                    default:
                        this[i] = config[i];
                        break;
                }

            }
        }
    },

    /**
     * @private
     */
    applyLintOptions : function (linter, options) {
        var i;

        if (!options) {
            return false;
        }

        for (i in options) {
            if (options.hasOwnProperty(i)) {
                linter.options[i] = options[i];
            }
        }
    },

    /**
     * @private
     */
    announceErrors : function (errorList) {
        if (typeof this.logFile === 'string') {
            this.logToFile(errorList);
        }

        this.log('\nFix Your Errors! Check the log file for more information.\n\n', true);
        phantom.exit(1);
    },

    /**
     * @private
     */
    announceSuccess : function () {
        this.log('\nSuccessfully linted your Javascript.\n\n', true);
        phantom.exit(0);
    },

    /**
     * @private
     */
    getFiles : function (path) {
        var tree = filesystem.list(path);

        this.log('\nFILES FOUND AT PATH: ' + path);
        this.log(tree);

        return tree;
    },

    /**
     * @private
     */
    parseTree : function (pathConfig) {
        var i = 0,
            regex = /\.js$/i,
            path = [];

        if (typeof pathConfig === 'string') {
            path[0] = pathConfig;
        }
        else {
            path = pathConfig; //should be an array of strings
        }

        for (i; i < path.length; i++) {
            var currPath = path[i];
            this.log('\n*** currPath: ' + currPath);

            if (this.exclusions) {
                this.log('Checking exclusion paths...');

                var j = 0;
                var exclude = false;

                for (j; j < this.exclusions.length; j++) {
                    if (currPath === this.exclusions[j]) {
                        exclude = true;
                    }
                }
            }

            if (exclude) {
                this.log('Excluding path: ' + currPath);
            }
            else {
                var list = this.getFiles(currPath);
                var x = 0;

                for (x; x < list.length; x++) {
                    var spacer = '    ',
                        childPath, childTree;

                    if (filesystem.isFile(currPath + list[x])) {
                        this.log(spacer + list[x] + ' IS A FILE');
                        /*
                         * We only want JS files
                         */
                        if (regex.test(list[x])) {
                            this.files.push(currPath + list[x]);
                            this.log(spacer + list[x] + ' IS A JS FILE. Added to the list.');
                        }
                        else {
                            this.log(spacer + list[x] + ' IS NOT A JS FILE');
                        }
                    }
                    else {
                        this.log(spacer + list[x] + ' IS NOT A FILE');

                        /*
                         * If not a file
                         *   - check against parent paths
                         *   - recurse into child paths
                         */
                        if (list[x] === '.' || list[x] === '..') {
                            this.log(spacer + list[x] + ' IS A RELATIVE DIRECTORY PATH');
                        }
                        else {
                            childPath = currPath + list[x] + '/';
                            this.parseTree(childPath);
                        }
                    }
                }
            }
        }
    },

    /**
     * @private
     */
    lintFiles : function () {
        var x = 0,
            errorList = [],
            j,
            linter;

        this.log('\n' + this.files.length + ' JS files found.', true);

        /*
         * Loop through all files with each linter
         */
        for (x; x < this.linters.length; x++) {
            linter = this.linters[x];

            if (linter === JSLINT) {
                this.log('Running JSLint against code...', false);
                errorList = this.runJSLint(errorList);
            }
            else if (linter === JSHINT) {
                this.log('Running JSHint against code...', false);
                errorList = this.runJSHint(errorList);
            }
        }

        if (errorList.length > 0) {
            this.announceErrors(errorList);
        }

        return errorList.length === 0;
    },

    /**
     * @private
     */
    runJSLint : function (errorList) {
        var j = 0,
            file, js;

        for (j; j < this.files.length; j++) {

            file = this.files[j];
            js = filesystem.read(file);

            var i = 0,
                result = JSLINT(js, this.jsLint.options),
                totalErrors = JSLINT.errors.length,
                error;

            if (!result) {
                for (i; i < totalErrors; i++) {
                    error = JSLINT.errors[i];

                    if (error) {
                        errorList.push(
                            file,
                            '    Line #: ' + error.line,
                            '    Char #: ' + error.character,
                            '    Reason: ' + error.reason,
                            '',
                            ''
                        );

                        if (this.stopOnFirstError) {
                            break;
                        }
                    }
                }

                if (this.stopOnFirstError && errorList.length > 0) {
                    this.announceErrors(errorList);
                }
            }
        }

        return errorList;
    },

    /**
     * @private
     */
    runJSHint : function (errorList) {
        var j = 0,
            file, js;

        for (j; j < this.files.length; j++) {

            file = this.files[j];
            js = filesystem.read(file);

            var i = 0,
                result = JSHINT(js, this.jsHint.options),
                totalErrors = JSHINT.errors.length,
                error;

            if (!result) {
                for (i; i < totalErrors; i++) {
                    error = JSHINT.errors[i];

                    if (error) {
                        errorList.push(
                            file,
                            '    Line #: ' + error.line,
                            '    Char #: ' + error.character,
                            '    Reason: ' + error.reason,
                            '',
                            ''
                        );

                        if (this.stopOnFirstError) {
                            break;
                        }
                    }
                }

                if (this.stopOnFirstError && errorList.length > 0) {
                    this.announceErrors(errorList);
                }
            }
        }

        return errorList;
    },

    /**
     * @private
     */
    logToFile : function (errorList) {
        this.log('\nWriting ' + (errorList.length / 6) + ' errors to log file.', true);
        filesystem.touch(this.logFile);

        var stream = filesystem.open(this.logFile, 'w');

        var i = 0;
        for (i; i < errorList.length; i++) {
            stream.writeLine(errorList[i]);
        }

        stream.close();
    },

    /**
     * @private
     */
    log : function (msg, override) {
        if (this.verbose || override) {
            console.log(msg);
        }
    }
};