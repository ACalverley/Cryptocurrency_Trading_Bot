
const bittrex = require('../node.bittrex.api');

bittrex.options({
  'verbose' : true,
});

bittrex.options({
  verbose: true,
  websockets: {
    onConnect: function() {
      console.log('onConnect fired');
      bittrex.websockets.subscribe(['BTC-ETH'], function(data, client) {
        if (data.M === 'updateExchangeState') {
          data.A.forEach(function(data_for) {
            console.log('Market Update for '+ data_for.MarketName);
          });
        }
      });
      
      
      bittrex.websockets.subscribe(['BTC-OMG'], function(data, client) {
        if (data.M === 'updateExchangeState') {
          data.A.forEach(function(data_for) {
            console.log('Market Update for '+ data_for.MarketName);
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