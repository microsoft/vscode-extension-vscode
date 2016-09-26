/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
'use strict';
var request = require('request');
function getContents(url, token, callback) {
    var headers = {
        'user-agent': 'nodejs'
    };
    if (token) {
        headers['Authorization'] = 'token ' + token;
    }
    var options = {
        url: url,
        headers: headers
    };
    request.get(options, function (error, response, body) {
        if (!error && response && response.statusCode >= 400) {
            error = new Error('Request returned status code: ' + response.statusCode + '\nDetails: ' + response.body);
        }
        callback(error, body);
    });
}
exports.getContents = getContents;
