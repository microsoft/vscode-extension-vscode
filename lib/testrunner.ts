/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

/// <reference path="../typings/node.d.ts" />
/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/glob.d.ts" />

'use strict';

import * as fs from 'fs';
import * as paths from 'path';
import * as glob from 'glob';
import Mocha = require('mocha');

let mocha = new Mocha({
	ui: 'tdd',
	useColors: true
});

export function configure(opts: MochaSetupOptions): void {
	mocha = new Mocha(opts);
}

export function run(testsRoot: string, clb: (error) => void): void {
	glob('**/*.js', { cwd: testsRoot }, (error, files) => {
		if (error) {
			return clb(error);
		}

		// Fill into Mocha
		files
			.filter(f => f !== 'index.js') // this is the initial testrunner file leading here, avoid loading it endlessly
			.forEach(f => mocha.addFile(paths.join(testsRoot, f)));

		// Run the tests.
		mocha.run()
			.on('end', function() {
				clb(null);
			});
	});
}