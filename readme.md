# Alite

A simple, tiny promise-based AJAX library.

- Zero dependencies
- Roughly 500 bytes minified and gzipped

[![Build Status](https://travis-ci.org/chrisdavies/alite.svg?branch=master)](https://travis-ci.org/chrisdavies/alite)

## Usage

Create a new instance of Alite:

```javascript
var alite = Alite();
```

### Get, Delete

Get and delete both take two arguments

- url: the url to which data is being sent
- requestHeaders: optional headers to be added to the request

```javascript
ajax.get('https://api.github.com/users')
  .then(function (result) {
    // Data is the deserialized JSON object that came back from the server
    // The request is also available in result.request
    console.log(result.data);
  })
  .catch(function (err) {
    // err.data is where you'll find the data (if any) that the server sent
    console.log(err.request.status);
  });

var promise = ajax.delete('users/24');
```

### Post, Put, Patch

Post, put and patch take three arguments

- url: the url to which data is being sent
- data: the data being sent
- requestHeaders: optional headers to be added to the request

```javascript
var promise = ajax.post('some/url', { the: 'data' });
```

### Request headers

If you need to send special headers or override standard ones, pass the
`requestHeaders` argument to the ajax method(s).

requestHeaders is a hash of header values to be sent:

```javascript
var credentials = {
  'Authorization': 'Basic ' + btoa(username + ':' + password)
};

// The header(s) are the 2nd argument to get and delete
var promise1 = ajax.get('/api/admins', credentials);

// The header(s) are the 3rd argument in post, put, and patch
var promise2 = ajax.post('/api/admins', new Admin(), credentials);

```

## Assumptions

Alite assumes that sends (post, put, patch) are sending JSON.

Alite requires Promise support. In older browsers, Promises can be shimmed
easily enough with something like [Plite](https://github.com/chrisdavies/plite).

Alite currently has a naive method of detecting if a response is JSON... If it
starts with `{` or `[`, then the response is considered JSON.

## Installing

Download and include `alite.min.js`

Or install using NPM:

    npm install alite

Or install using Bower:

    bower install alite

## License MIT

Copyright (c) 2015 Chris Davies

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
