(function (Alite) {

  describe('Alite', function () {

    it('gets', function (done) {
      sendData('GET', '/foo', undefined, done);
    });

    it('deletes', function (done) {
      sendData('DELETE', '/foo', undefined, done);
    });

    it('posts', function (done) {
      sendData('POST', '/users', { hello: 'world' }, done);
    });

    it('puts', function (done) {
      sendData('PUT', '/users', { name: 'Joe' }, done);
    });

    it('patches', function (done) {
      sendData('PATCH', '/users', { name: 'Shmo' }, done);
    });

    it('parses JSON-like responses', function (done) {
      var req = MockReq();
      var ajax = Alite(req.mockConstructor);

      ajax.get('/foo').then(function (result) {
        expect(result.name).toEqual('Jimmy');
        done();
      }).catch(function () {
        expect(false).toBe(true); // Catch should not get called...
      });

      req.exec(200, '{ "name": "Jimmy" }');
    });

    it('attaches xhr to the promise', function () {
      var req = MockReq();
      var ajax = Alite(req.mockConstructor);
      var promise = ajax.get('/foo');

      expect(promise.xhr).toBe(req);
    });

    it('calls before/after functions', function (done) {
      var req = MockReq();
      var ajax = Alite(req.mockConstructor);
      var flags = {
        start: false,
        instStart: false,
        stop: false,
      };

      ajax.ajaxStart = function (xhr) {
        expect(xhr).toBe(req);
        expect(flags.start || flags.stop).toBe(false);
        flags.start = true;
      };

      ajax.ajaxStop = function (xhr) {
        expect(xhr).toBe(req);
        expect(flags.start).toBe(true);
        expect(flags.stop).toBe(false);
        flags.stop = true;
      };

      ajax.get({
        url: '/baz',
        raw: true,
        data: 123,
        ajaxStart: function (xhr) {
          expect(xhr).toBe(req);
          expect(flags.start).toBe(true);
          expect(flags.stop).toBe(false);
          expect(flags.instStart).toBe(false);
          flags.instStart = true;
        }
      }).then(function (result) {
        expect(flags.start && flags.stop).toBe(true);
        done();
      }).catch(function (result) {
        expect(false).toBe(true);
      });

      req.exec(200, '[]');
    });

    it('allows sending raw data', function (done) {
      var req = MockReq();
      var ajax = Alite(req.mockConstructor);

      ajax.get({
        url: '/baz',
        raw: true,
        data: 123
      }).then(function (result) {
        expect(req.sent).toBe(123);
        done();
      }).catch(function (result) {
        expect(false).toBe(true);
      });

      req.exec(200, '[]');
    });

    it('handles error statuses', function (done) {
      testError(404, done);
      testError(400, done);
      testError(500, done);
      testError(301, done);
    });

    it('allows headers to be set', function () {
      var req = MockReq();
      var ajax = Alite(req.mockConstructor);

      ajax.get({
        url: '/baz',
        headers: {
          'content-type': 'text/html',
          'blam': 'blast'
        }
      });

      expect(req.headers['content-type']).toEqual('text/html');
      expect(req.headers['blam']).toEqual('blast');
      req.exec(200, 'OK');
    });

    function testError(code, done) {
      var req = MockReq();
      var ajax = Alite(req.mockConstructor);

      ajax.get({ url: '/baz' }).then(function (result) {
        expect(false).toBe(req.status); // Then should not get called...
      }).catch(function (result) {
        expect(result.message).toBe('Doh');
        done();
      });

      expect(req.sent).toBeUndefined();
      req.exec(code, '{ "message": "Doh" }');
    }

    function sendData(method, url, data, done) {
      var req = MockReq();
      var ajax = Alite(req.mockConstructor);

      ajax[method.toLowerCase()]({ url: url, data: data }).then(function (result) {
        expect(result).toEqual('OK');
        done();
      }).catch(function () {
        expect(false).toBe(true); // Catch should not get called...
      });

      expect(req.method.toLowerCase()).toEqual(method.toLowerCase());
      expect(req.url).toEqual(url);
      data && expect(req.sent).toEqual(JSON.stringify(data));
      req.exec(200, 'OK');
    }

    function MockReq() {
      var self = {
        onreadystatechange: undefined,
        responseText: undefined,
        status: undefined,
        method: undefined,
        url: undefined,
        readyState: 0,
        headers: {},
        sent: undefined,

        open: function (method, url) {
          self.method = method;
          self.url = url;
        },

        setRequestHeader: function (name, value) {
          self.headers[name] = value;
        },

        send: function (data) {
          self.sent = data;
        },

        exec: function (status, responseText) {
          self.readyState = 4;
          self.status = status;
          self.responseText = responseText;
          self.onreadystatechange();
        },

        mockConstructor: function () {
          return self;
        }
      };

      return self;
    }
  });

})(this.Alite || require('../alite'));
