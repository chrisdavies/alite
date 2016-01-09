# Alite

A simple, tiny promise-based AJAX library.

- Zero dependencies
- Less than 450 bytes minified and gzipped

[![Build Status](https://travis-ci.org/chrisdavies/alite.svg?branch=master)](https://travis-ci.org/chrisdavies/alite)

## Usage

```js
alite({
  // Required: the URL to send/receive from
  url: '/api/foo/bar',

  method: 'POST',

  // Optional: the object to send as JSON, or raw if the raw flag is set
  data: { foo: 'bar' },

  // Optional: A flag indicating whether or not this is a raw request
  // (by default, this is false, and data is turned into a JSON string)
  raw: false,

  // Optional: an object containing the HTTP headers to set
  headers: {
    'Authorization': 'Basic ' + btoa(username + ':' + password)
  },

  // Optional: a function that constructs and returns an XMLHttpRequest object
  xhr: function () {
    // ...
  }
}).then(function (result) {
  console.log('GOT ', result);
}).catch(function (err) {
  console.error(err);
});


```

### Promises

Each of these methods returns a promise, and so is generally called like this:

```javascript
alite({ url: 'https://api.github.com/users', method: 'GET' })
  .then(function (result) {
    // Result is the deserialized JSON object/array that came back from the server
    console.log(result);
  })
  .catch(function (err) {
    // err is the deserialzed JSON object/array that was returned from the server,
    // or a string, if the response was not JSON
    console.log(err);
  });
```

### Example file upload

The following code is taken from a production app that uploads files to S3:

```js
// File is a file object obtained from an input[type=file] element
// presigned is an object representing AWS S3 presigned URL info...
function upload(file, presigned) {
  var data = new FormData();
  data.append('utf8', '✓');
  data.append('Content-Type', file.type);
  data.append('Content-Disposition', 'attachment; filename = "${filename}"');
  data.append('key', presigned.fullKey);
  data.append('AWSAccessKeyId', presigned.awsAccessKeyId);
  data.append('acl', presigned.acl);
  data.append('policy', presigned.policy);
  data.append('signature', presigned.signature);
  data.append('file', file);

  return alite({
    url: presigned.url,
    method: 'post',
    data: data,
    raw: true,
    xhr: function () {
      var xhr = new XMLHttpRequest();
      xhr.upload.addEventListener('progress', function (e) {
        const progress = Math.ceil((e.loaded / e.total) * 100);

        // This is a Redux dispatch to update progress in the UI
        dispatch({
          type: 'upload_progress',
          abort: () => xhr.abort(),
          progress,
          file
        });
      }, false);
      return xhr;
    }
  });
}
```

### Global AJAX notifications: ajaxStart/ajaxStop

The Alite object has two properties which you can set in order to receive notifications
when an ajax request starts or completes:

```js
var alite = Alite();

// xhr is the raw XMLHttpRequest object
// opts is the argument that was passed to the Alite ajax method
//   that triggered this request.
alite.ajaxStart = function (xhr, opts) {
  // Pass the CSRF token along with the request...
  xhr.setRequestHeader('X-CSRF-Token', document.querySelector('meta[name="csrf-token"]').getAttribute('content'));
};

alite.ajaxStop = function (xhr, opts) {
  // This runs whenever an AJAX request has completed (success or error)
};
```

## Assumptions

If `raw` is not specified or is false, data is sent as JSON and is automatically serialized for you.

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
