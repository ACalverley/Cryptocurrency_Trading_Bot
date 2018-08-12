var rsi = require('./rsi.js');
var fs = require('fs')

var stream = fs.createWriteStream("results.txt")

var writeOutput = (trade) => {
	stream.write(trade);
}

writeOutput('Start_Time ' + getDateTime());
writeOutput('Date Time_Period Action Last_Eth_Price Current_Eth_Price %_Difference');

for (var time_period = 1; time_period < 30; time_period++){
	stream.once('open', () => {
		rsi(time_period, writeOutput);
	});
}
