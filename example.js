var express = require('express');
var getMicrodata = require('node-microdata-scraper');   // extract microdata from a website
var app = express();                                    // create an instance of express
var offline = require('./index.js');                    // load express-offline middleware module

// add express-offline middleware to intercept requests (must be added before all other routes)
app.use(offline());

// demo express route to extract microdata from a webpage passed as a querystring
app.get('/microdata', function(req, res) {

    var url = req.query.url;

    // extract microdata from URL and return to browser
    getMicrodata.parseUrl(url, function(err, data) {

        var json = JSON.parse(data);

        res.json(json);
    });
});

app.listen(8080);