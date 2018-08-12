const binance = require('node-binance-api');
const bittrex = require('node-bittrex-api');

binance.options({
    'APIKEY': process.env.BINANCE_KEY,
    'APISECRET': process.env.BINANCE_SECRET
});
 
bittrex.options({
    'apikey' : '',
    'apisecret' : ''
});


module.exports.binance = binance;
module.exports.bittrex = bittrex;