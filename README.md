# check-params
Validates url, body, and query parameters for Express and SailsJS

This module requires an Express or SailsJS server.


## Installation

```sh
$ npm install --save check-params
```


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
        }).then(function(message) {
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


## More Details

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


## License

MIT © [Jam Risser](http://jam.jamrizzi.com)

[npm-url]: https://npmjs.org/package/check-params
