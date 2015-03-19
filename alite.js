function Alite(XMLHttpRequest) {

  XMLHttpRequest = XMLHttpRequest || this.XMLHttpRequest;

  function response(req) {
    var isJson = req && req.responseText &&
        req.responseText[0] == '{' ||
        req.responseText[0] == '[';

    return {
      request: req,
      data: isJson ? JSON.parse(req.responseText) : req.responseText
    };
  }

  function ajax(httpMethod, url, params, requestHeaders) {
    return new Promise(function(resolve, reject) {
      var req = new XMLHttpRequest();

      req.onreadystatechange = function () {
        if (req.readyState == 4) {
          if (req.status >= 200 && req.status < 300) {
            resolve(response(req));
          } else {
            reject(response(req));
          }
        }
      }

      req.open(httpMethod, url);
      req.setRequestHeader('content-type', 'application/json');

      if (requestHeaders) {
        for (var name in requestHeaders) {
          req.setRequestHeader(name, requestHeaders[name]);
        }
      }

      req.send(params ? JSON.stringify(params) : undefined);
    });
  }

  return {
    get: function (url, requestHeaders) {
      return ajax('GET', url, undefined, requestHeaders);
    },

    'delete': function (url, requestHeaders) {
      return ajax('DELETE', url, undefined, requestHeaders);
    },

    post: function (url, data, requestHeaders) {
      return ajax('POST', url, data, requestHeaders);
    },

    put: function (url, data, requestHeaders) {
      return ajax('PUT', url, data, requestHeaders);
    },

    patch: function (url, data, requestHeaders) {
      return ajax('PATCH', url, data, requestHeaders);
    }
  };
}

if (typeof module === 'object' && typeof define !== 'function') {
  module.exports = Alite;
}
