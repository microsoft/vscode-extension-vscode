/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
/// <reference path="../typings/node.d.ts" />
'use strict';
var request = require('request');
function getContents(url, callback) {
    var headers = {
        'user-agent': 'nodejs'
    };
    if (process.env.GITHUB_TOKEN) {
        headers['Authorization'] = 'token ' + process.env.GITHUB_TOKEN;
    }
    var options = {
        url: url,
        headers: headers
    };
    request.get(options, function (error, response, body) {
        callback(error, body);
    });
}
exports.getContents = getContents;
