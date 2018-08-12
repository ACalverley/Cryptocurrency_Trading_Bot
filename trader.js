var rsi = require('./rsi.js');
var fs = require('fs')

var stream = fs.createWriteStream("results.txt")

var writeOutput = (trade) => {
	stream.write(trade)
	// console.log("Most Recent RSI: ", rsi);
}

stream.once('open', () => {
	rsi(5, writeOutput);
});


// rsi(5, writeRSI);

// rsi(60);
// rsi(120);

// rsi(10);


