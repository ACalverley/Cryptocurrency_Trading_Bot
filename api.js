const binance_module = require('node-binance-api');
// const bittrex = require('node-bittrex-api');

// console.log(process.env.BINANCE_KEY);

const binance = new binance_module().options({
					    'APIKEY': process.env.BINANCE_KEY,
					    'APISECRET': process.env.BINANCE_SECRET,
					    useServerTime: true
					});
 
// bittrex.options({
//     'apikey' : '',
//     'apisecret' : ''
// });


// instance1.prices('BNBBTC', (error, ticker) => {
//   console.log("Price of BNB: ", ticker.BNBBTC);
// });

module.exports.binance = binance;
// module.exports.bittrex = bittrex;