/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
/// <reference path="../typings/node.d.ts" />
/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/glob.d.ts" />
'use strict';
var paths = require('path');
var glob = require('glob');
var Mocha = require('mocha');
var mocha = new Mocha({
    ui: 'tdd',
    useColors: true
});
function configure(opts) {
    mocha = new Mocha(opts);
}
exports.configure = configure;
function run(testsRoot, clb) {
    glob('**/*.js', { cwd: testsRoot }, function (error, files) {
        if (error) {
            return clb(error);
        }
        // Fill into Mocha
        files
            .filter(function (f) { return f !== 'index.js'; }) // this is the initial testrunner file leading here, avoid loading it endlessly
            .forEach(function (f) { return mocha.addFile(paths.join(testsRoot, f)); });
        // Run the tests.
        mocha.run()
            .on('end', function () {
            clb(null);
        });
    });
}
exports.run = run;
