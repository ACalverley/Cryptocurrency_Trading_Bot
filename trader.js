var api = require('./api.js');
var rsi = require('./rsi.js');

var printRSI = (rsi) => console.log("most recent RSI: ", rsi);

rsi(5, printRSI);

// rsi(60);
// rsi(120);

// rsi(10);


