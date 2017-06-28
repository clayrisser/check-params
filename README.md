# check-params

[![npm](https://img.shields.io/npm/v/check-params.svg?style=flat-square)](https://www.npmjs.com/package/check-params)[![npm](https://img.shields.io/npm/dt/check-params.svg?style=flat-square)](https://www.npmjs.com/package/check-params)

Validates url, body, and query parameters for Express

Please &#9733; this repo if you found it useful &#9733; &#9733; &#9733;


## Features

* Check body params
* Check query params
* Check url params


## Installation

```sh
$ npm install --save check-params
```


## Dependencies

* [Node](https://nodejs.org/)
* [Express](https://expressjs.com/)


## Usage

```js
var checkParams = require('check-params');

module.exports = {
  exampleController: function(req, res)  {
    checkParams(req, {
      queryParams: [
        'hello',
        'foo'
      ]
    }).then(function() {
      res.json({
        message: 'Yaaaay, I have everything I need!!!'
      });
    }).catch(function(err) {
      console.warn(err);
      res.status(err.code).json({
        message: err.message
      });
    });
  }
};
```

Now, if I enter the following url . . .
```url
http://myserver.com/example?hello=world&foo=bar
```
. . . I get the following response.
```json
{
  "message": "Yaaaay, I have everything I need!!!"
}
```

However, if I enter the following url, without the query params . . .
```url
http://myserver.com/example
```
. . . I get the following response.
```json
{
  "message": "You are missing the query params 'hello', and 'foo'."
}
```

If you do not put in the required parameters, you will get a response asking for them.

### More Details

The checkParams function recieves three properties. The last property, options, is optional.
```js
checkParams(
  req, // the request object
  {
    urlParams: [], // an array of required url params
    bodyParams: [], // an array of required body params
    queryParams: [] // an array of required query params
  },
  { // the options property is not required
    distictChar: '\'', // the default character to distinguish missing parameters in the error message 
    oxfordComma: true // whether to use oxford comma's when separating lists
  } 
);
```

The checkParams function always returns as a promise. It is also good to note, that the err response has
a property called code. This contains the suggested response status code.


## Support

Submit an [issue](https://github.com/jamrizzi/check-params/issues/new)


## Buy Me Coffee

A ridiculous amount of coffee was consumed in the process of building this project.

[Add some fuel](https://pay.jamrizzi.com/) if you'd like to keep me going!


## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D


## License

[MIT License](https://github.com/jamrizzi/check-params/blob/master/LICENSE)

[Jam Risser](https://jamrizzi.com) &copy; 2017


## Credits

* [Jam Risser](https://jamrizzi.com) - Author


## Changelog

0.3.0 (2017-06-28)
* Removed message response

0.1.0 (2016-10-25)
* Beta release
