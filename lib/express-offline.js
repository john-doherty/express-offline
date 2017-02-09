'use strict';

var path = require('path');
var appRoot = require('app-root-path');
var fs = require('fs-promise');
var mime = require('mime');

module.exports = function(offlineEnabled, resourcePath) {

    // attempt to find a path to the offline files
    resourcePath = process.env.OFFLINE_PATH || resourcePath || path.join(appRoot.toString(), 'offline');

    // is offline mode active
    offlineEnabled = process.env.OFFLINE || offlineEnabled;

    // return express middleware to intercept requests
    return function(req, res, next) {

        if (offlineEnabled) {

            // get the first accept header from the incoming request
            var acceptHeader = (req.get('accept') || '').split(',')[0];

            // determine the file extension based on request type
            var extension = acceptHeader ? '.' + mime.extension(acceptHeader) : '';

            // construct path to offline file matching this request
            var filename = path.resolve(path.join(resourcePath, req.method, req.path + extension)).toLowerCase();

            // check if the file exists, if so return it, otherwise 404
            fs.exists(filename).then(function (exists) {

                if (exists) {
                    res.sendFile(filename);
                }
                else {
                    res.status(404).end();
                }
            });
        }
        else {
            // app is not in offline mode, therefore do nothing
            next();
        }
    };
};