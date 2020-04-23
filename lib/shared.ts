/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

'use strict';

import { parse as parseUrl } from 'url';
import * as https from 'https';

const HttpsProxyAgent = require('https-proxy-agent');
const HttpProxyAgent = require('http-proxy-agent');

let PROXY_AGENT = undefined;
let HTTPS_PROXY_AGENT = undefined;

if (process.env.npm_config_proxy) {
	PROXY_AGENT = new HttpProxyAgent(process.env.npm_config_proxy);
	HTTPS_PROXY_AGENT = new HttpsProxyAgent(process.env.npm_config_proxy);
}
if (process.env.npm_config_https_proxy) {
	HTTPS_PROXY_AGENT = new HttpsProxyAgent(process.env.npm_config_https_proxy);
}

export function getContents(url: string, token?: string, headers?: any, callback?: (err: Error, body?: any) => void) {
    const options = toRequestOptions(url, token, headers);

    https.get(options, res => {
        if (res && res.statusCode >= 400) {
            callback(new Error('Request returned status code: ' + res.statusCode));
        }

        let data = '';

        res.on('data', chunk => {
            data += chunk;
        });

        res.on('end', () => {
            callback(null, data);
        });
    }).on('error', e => {
        callback(e);
    });
}

function toRequestOptions(url: string, token: string | null, headers = { 'user-agent': 'nodejs' }): https.RequestOptions {
    const options: https.RequestOptions = parseUrl(url);
	if (PROXY_AGENT && options.protocol.startsWith('http:')) {
		options.agent = PROXY_AGENT;
    }
	if (HTTPS_PROXY_AGENT && options.protocol.startsWith('https:')) {
		options.agent = HTTPS_PROXY_AGENT;
    }

    if (token) {
        headers['Authorization'] = 'token ' + token;
    }

    options.headers = headers;

    // We need to test the absence of true here because there is an npm bug that will not set boolean
    // env variables if they are set to false.
    if (process.env.npm_config_strict_ssl !== 'true') {
        options.rejectUnauthorized = false;
    }

    return options;
}