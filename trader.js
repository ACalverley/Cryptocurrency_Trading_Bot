var mongoose = require('mongoose');
require('dotenv').config()
var rsi = require('./rsi.js');
var fs = require('fs')
// mongoose.Promise = global.Promise;
// mockgoose.helper.setDbVersion('3.4.3');
mongoose.connect('mongodb://localhost:27017/rsi_db', { useNewUrlParser: true });

var stream = fs.createWriteStream("results.txt")

var writeOutput = (trade) => {
	stream.write(trade);
}

writeOutput('Start_Time ' + rsi.getDateTime);
writeOutput('Date Time_Period Action Last_Eth_Price Current_Eth_Price %_Difference');

// for (var time_period = 3; time_period < 15; time_period += 2){
stream.once('open', () => {
	rsi(mongoose, 10, writeOutput);
});
// }
