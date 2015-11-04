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
	
	// Enable source map support
	require('source-map-support').install();
	
	// Glob test files
	glob('**/**.test.js', { cwd: testsRoot }, (error, files) => {
		if (error) {
			return clb(error);
		}

		try {
			
			// Fill into Mocha
			files.forEach(f => mocha.addFile(paths.join(testsRoot, f)));
	
			// Run the tests.
			mocha.run()
				.on('end', function() {
					clb(null);
				});
		} catch (error) {
			return clb(error);
		}
	});
}