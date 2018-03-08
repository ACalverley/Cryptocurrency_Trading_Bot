var assert = require('assert');
var bittrex = require('../node.bittrex.api.js');

describe('Bittrex websocket API', function() {

  it('Connect to the Websocket and receive global ticker data', function(done) {
    this.timeout(50000);
    bittrex.options({
      websockets: {
        onConnect: function() {
          bittrex.websockets.listen(function(data) {
            if (data.M === 'updateSummaryState') {
              done();
            }
          });
        },
      },
    });
    bittrex.websockets.client();
  });

});