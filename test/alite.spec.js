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
        expect(result.data.name).toEqual('Jimmy');
        done();
      }).catch(function () {
        expect(false).toBe(true); // Catch should not get called...
      });

      req.exec(200, '{ "name": "Jimmy" }');
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

      ajax.get('/baz', {
        'content-type': 'text/html',
        'blam': 'blast'
      });

      expect(req.headers['content-type']).toEqual('text/html');
      expect(req.headers['blam']).toEqual('blast');
      req.exec(200, 'OK');
    });

    function testError(code, done) {
      var req = MockReq();
      var ajax = Alite(req.mockConstructor);

      ajax.get('/baz').then(function (result) {
        expect(false).toBe(req.status); // Then should not get called...
      }).catch(function (result) {
        expect(result.request).toBe(req);
        done();
      });

      expect(req.sent).toBeUndefined();
      req.exec(code, 'Whatevz');
    }

    function sendData(method, url, data, done) {
      var req = MockReq();
      var ajax = Alite(req.mockConstructor);

      ajax[method.toLowerCase()](url, data).then(function (result) {
        expect(result.data).toEqual('OK');
        expect(result.request).toBe(req);
        done();
      }).catch(function () {
        expect(false).toBe(true); // Catch should not get called...
      });

      expect(req.method).toEqual(method);
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
