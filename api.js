const binance = require('node-binance-api');
const bittrex = require('node-bittrex-api');

binance.options({
    'APIKEY':'',
    'APISECRET':''
});

bittrex.options({
    'apikey' : '',
    'apisecret' : ''
});


module.exports.binance = binance;
module.exports.bittrex = bittrex;