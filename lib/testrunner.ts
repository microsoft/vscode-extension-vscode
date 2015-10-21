/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

/// <reference path="../typings/node.d.ts" />
/// <reference path="../typings/mocha.d.ts" />

'use strict';

import * as fs from 'fs';
import * as paths from 'path';
import Mocha = require('mocha');

let mocha = new Mocha({
	ui: 'tdd',
	useColors: true
});

export function configure(opts:MochaSetupOptions): void {
	mocha = new Mocha(opts);	
}

export function run(testsRoot: string, clb: (error) => void): void {
	fs.readdir(testsRoot, (error, files) => {
		if (error) {
			return clb(error);
		}

		// Fill into Mocha
		files
			.filter(f => f.substr(-3) === '.js' && f !== 'index.js')
			.forEach(f => mocha.addFile(paths.join(testsRoot, f)));

		// Run the tests.
		mocha.run()
			.on('end', function() {
				clb(null);
			});
	});
}