
const bittrex = require('../node.bittrex.api');

bittrex.options({
  verbose: true,
  websockets: {
    onConnect: function() {
      console.log('onConnect fired');
      bittrex.websockets.listen(function(data, client) {
        if (data.M === 'updateSummaryState') {
          data.A.forEach(function(data_for) {
            data_for.Deltas.forEach(function(marketsDelta) {
              console.log('Ticker Update for '+ marketsDelta.MarketName, marketsDelta);
            });
          });
        }
      });
    },
  },
});

console.log('Connecting ....');
bittrex.websockets.client(function(client) {
  // connected - you can do any one-off connection events here
  //
  // Note: Reoccuring events like listen() and subscribe() should be done
  // in onConnect so that they are fired during a reconnection event.
  console.log('Connected');
});