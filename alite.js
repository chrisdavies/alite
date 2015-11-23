function Alite(XMLHttpRequest) {
  XMLHttpRequest = XMLHttpRequest || this.XMLHttpRequest;

  function response(req) {
    var responseText = req && req.responseText;
    var isJson = responseText &&
        (responseText[0] == '{' || responseText[0] == '[');

    return isJson ? JSON.parse(responseText) : responseText;
  }

  var alite = {
    ajaxStart: function () { },
    ajaxStop: function () { },

    ajax: function (opts) {
      var req = new XMLHttpRequest();
      var promise = new Promise(function(resolve, reject) {
        var data = opts.raw ? opts.data : (opts.data ? JSON.stringify(opts.data) : undefined);

        req.onreadystatechange = function () {
          if (req.readyState == 4) {
            if (req.status >= 200 && req.status < 300) {
              resolve(response(req));
            } else {
              reject(response(req));
            }

            alite.ajaxStop(req, opts);
          }
        }

        req.open(opts.method, opts.url);
        !opts.raw && req.setRequestHeader('content-type', 'application/json');

        if (opts.headers) {
          for (var name in opts.headers) {
            req.setRequestHeader(name, opts.headers[name]);
          }
        }

        alite.ajaxStart(req, opts);
        opts.ajaxStart && opts.ajaxStart(req);

        req.send(data);
      });

      promise.xhr = req;
      return promise;
    }
  };

  ['put', 'post', 'patch', 'get', 'delete'].forEach(function (httpMethod) {
    alite[httpMethod] = function (opts) {
      opts.method = httpMethod;
      return this.ajax(opts);
    }
  });

  return alite;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Alite;
}