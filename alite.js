function alite(opts) {
  function noop() { }

  function response(req) {
    var responseText = req && req.responseText;
    var isJson = /^[\{\[]/.test(responseText);

    return isJson ? JSON.parse(responseText) : responseText;
  }

  return new Promise(function(resolve, reject) {
    var req = (opts.xhr || noop)() || new XMLHttpRequest();
    var data = opts.data;

    req.onreadystatechange = function () {
      if (req.readyState == 4) {
        if (req.status >= 200 && req.status < 300) {
          resolve(response(req));
        } else {
          reject(response(req));
        }

        (alite.ajaxStop || noop)(req, opts);
      }
    }

    req.open(opts.method, opts.url);
    !opts.raw && req.setRequestHeader('Content-Type', 'application/json');

    if (opts.headers) {
      for (var name in opts.headers) {
        req.setRequestHeader(name, opts.headers[name]);
      }
    }

    (alite.ajaxStart || noop)(req, opts);
    (opts.ajaxStart || noop)(req);

    req.send(opts.raw ? data : (data ? JSON.stringify(data) : undefined));
  })
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = alite;
}
