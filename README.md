# express-offline
[![Linked In](https://img.shields.io/badge/Linked-In-blue.svg)](https://www.linkedin.com/in/john-i-doherty) [![Twitter Follow](https://img.shields.io/twitter/follow/CambridgeMVP.svg?style=social&label=Twitter&style=plastic)](https://twitter.com/CambridgeMVP)

Allows an express app be placed into offline mode and automagically serve responses from disk.

## Installation

```bash
npm install --save express-offline
```

## Usage

In the example below, the `/microdata` route extracts microdata from any website and returns it as a JSON object. So, if we run the example and request `localhost:8080/microdata?url=http://mammothworkwear.com/dickies-proban-coverall-p562.htm` it will return a JSON object containing product information:

```json
{
    ...
    {
        "id": "14ef1e7a452ceca27c8124b3c26f4b74",
        "name": "http://schema.org/Product",
        "properties": {
            "name": "Dickies Proban Coverall",
            "manufacturer": "Dickies",
            "brand": "Dickies",
            "mpn model": "FR4869",
            "image": "http://mammothworkwear.com/dickies-proban-coverall-w385h385q94i6368.jpg",
            "description": "If your workplace really cranks up the heat - literally as well as figuratively - then the Dickies Proban Coverall is for you. Constructed from special flame-retardant fabrics to comply with safety standards EN531 and EN470, this boiler suit offers high quality and reliable performance in hazardous areas. If you can expect a tripartite attack from fire, sparks and molten materials all before lunchtime, you'll need this kind of self-extinguishing clothing. Made to limit burn injuries and protect you against extreme heat, the overalls are ideal for those who work in the welding trade. As well as sporting a proban finish, the garment comes with a concealed stud front and cuffs with stud closure. There's also a studded neck closure, to ensure no sections of clothing come unhoused and dangle over flames and suchlike. Constructed from 330g of 100% cotton drill, this one comes with reinforced stress points and a pair of patch pockets at the chest. There are also further pockets in the seat and at the sides. If you can't stand the heat, don't get out of the workplace - get into the Dickies Proban Flame Retardant Overalls.",
            "offers": "1 to 445.47"
        }
    }
    ...
}
```

We probably dont want to be hitting the [workwear site](http://mammothworkwear.com) for every request during development, so we add the `express-offline` middleware and run our app with the environment variable OFFLINE=true.

Future requests will now return the contents of `./offline/get/microdata.json`

```js
var express = require('express');
var getMicrodata = require('node-microdata-scraper');   // extract microdata from a website
var app = express();                                    // create an instance of express
var offline = require('express-offline');                // load express-offline middleware module

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
```

## Mapping requests to files

By default `express-offline` will look for an `offline` folder in the root of your application, it will then look for a subfolder matching the request method `get`, `post` etc. Finally it will look for a file matching the `req.path` with a file extension matching the request accept header. 

If your accept header is `Accept: application/json` it will look for a `.json` file. Likewise `Accept: text/html` would look for a `.html` file.

 * `app.get('/microdata')` with an accept header of `Accept: application/json` would map to `./offline/get/microdata.json`
 * `app.post('/random')` with an accept header of `Accept: text/html` would map to `./offline/post/random`.

 ## Example
 
This project includes a working example. You can run in online mode using:

`node ./node-modules/express-offline/example.js`

And in offline mode using:

`OFFLINE=true node ./node-modules/express-offline/example.js`

## Contribute

The following tasks need doing, so please feel free to contribute:

    * Add unit tests
    * Clean up documentation


## License

Licensed under [ISC License](LICENSE) &copy; [John Doherty](https://twitter.com/CambridgeMVP)