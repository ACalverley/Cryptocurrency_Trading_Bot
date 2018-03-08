module.exports = function(timePeriod, callback) {
    var mongoose = require('mongoose');
    mongoose.connect('mongodb://localhost/rsi_db');
    var api = require('./api.js');

    var rsiSchema = new mongoose.Schema({
        entry: Number,
        time: String,
        price: Number,
        change: Number,
        gain: Number,
        loss: Number,
        avgGain: Number,
        avgLoss: Number,
        rs: Number,
        rsi: Number
    });

    var entryNum = 0;
    var sumGains = 0,
        sumLoss = 0;
    var currAvgGain, currAvgLoss;
    var RSI = mongoose.model("RSI_" + timePeriod, rsiSchema);
    
    
    ///////////////////////////////////   Start   ////////////////////////////////////////////////////
    
    startRSI(callback);
    
    function startRSI(callback) {
        clearDatabase();
        runRSI(callback);
    }

    async function runRSI(callback) {
        var rsi_value = await addRSI();
        console.log("rsi value", rsi_value);
        console.log(getDateTime());
        console.log('waiting');
        await wait(timePeriod);
        callback(rsi_value);
        runRSI(callback);
    }

    async function addRSI() {
        var ethPrice = await getETHprice();
        var change, gain, loss, rs, rsi;

        if (entryNum == 0) {
            rsi = null;
            RSI.create({
                entry: entryNum,
                time: getDateTime(),
                price: ethPrice,
                change: null,
                gain: null,
                loss: null,
                avgGain: null,
                avgLoss: null,
                rs: null,
                rsi: rsi
            }, (err, entry) => {
                if (err) console.log("error occured");
                else {
                    console.log("entry saved: ", entry);
                    ++entryNum;
                }
            });
        }

        else if (entryNum > 0 && entryNum < 15) {
            rsi = null;
            change = await getChange(ethPrice);

            if (change == 0) {
                gain = 0;
                loss = 0;
            }
            else if (change > 0) {
                gain = change;
                sumGains += gain;
                loss = 0;
            }
            else {
                loss = Math.abs(change);
                sumLoss += loss;
                gain = 0;
            }

            RSI.create({
                entry: entryNum,
                time: getDateTime(),
                price: ethPrice,
                change: change,
                gain: gain,
                loss: loss,
                avgGain: null,
                avgLoss: null,
                rs: null,
                rsi: rsi
            }, (err, entry) => {
                if (err) console.log("error occured");
                else {
                    console.log("entry saved: ", entry);
                    ++entryNum;
                }
            });
        }

        else if (entryNum == 15) {
            change = await getChange(ethPrice);

            if (change == 0) {
                gain = 0;
                loss = 0;
            }
            else if (change > 0) {
                gain = change;
                sumGains += gain;
                loss = 0;
            }
            else {
                loss = Math.abs(change);
                sumLoss += loss;
                gain = 0;
            }

            var firstAvgGain = sumGains / 14;
            var firstAvgLoss = sumLoss / 14;
            currAvgGain = firstAvgGain;
            currAvgLoss = firstAvgLoss;

            rs = currAvgGain / currAvgLoss;
            rsi = 100 - (100 / (1 + rs));

            RSI.create({
                entry: entryNum,
                time: getDateTime(),
                price: ethPrice,
                change: change,
                gain: gain,
                loss: loss,
                avgGain: currAvgGain,
                avgLoss: currAvgLoss,
                rs: rs,
                rsi: rsi
            }, (err, entry) => {
                if (err) console.log("error occured");
                else {
                    console.log("entry saved: ", entry);
                    ++entryNum;
                    console.log("returning from addRSI");
                }
            });
        }

        else {
            change = await getChange(ethPrice);

            if (change == 0) {
                gain = 0;
                loss = 0;
            }
            else if (change > 0) {
                gain = change;
                sumGains += gain;
                loss = 0;
            }
            else {
                loss = Math.abs(change);
                sumLoss += loss;
                gain = 0;
            }

            currAvgGain = ((currAvgGain * 13) + gain) / 14;
            currAvgLoss = ((currAvgLoss * 13) + loss) / 14;

            rs = currAvgGain / currAvgLoss;
            rsi = 100 - (100 / (1 + rs));

            RSI.create({
                entry: entryNum,
                time: getDateTime(),
                price: ethPrice,
                change: change,
                gain: gain,
                loss: loss,
                avgGain: currAvgGain,
                avgLoss: currAvgLoss,
                rs: rs,
                rsi: rsi
            }, (err, entry) => {
                if (err) console.log("error occured");
                else {
                    console.log("entry saved: ", entry);
                    ++entryNum;
                    console.log("returning from addRSI");
                }
            });
        }
        
        console.log("inside addRSI: ",rsi);
        return rsi;
    }

    function getChange(ethPrice) {
        return new Promise((res, rej) => {
            var lastEntry = entryNum - 1;
            console.log("searching for entry: ", lastEntry);
            RSI.find({ entry: lastEntry }, (err, result) => {
                if (err) console.log("error retrieving last entry");
                else {
                    console.log("last price: ", result[0].price);
                    res(ethPrice - result[0].price);
                }
            });
        });
    }

    function getETHprice() {
        return new Promise((res, rej) => {
            api.binance.prices((ticker) => {
                res(ticker.ETHBTC);
            })
        });
    }

    function wait(timePeriod) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve('resolved');
            }, (timePeriod * 1000));
        });
    }

    function getDateTime() {
        var date = new Date();
        var hour = date.getHours();
        hour = (hour < 10 ? "0" : "") + hour;
        var min = date.getMinutes();
        min = (min < 10 ? "0" : "") + min;
        var sec = date.getSeconds();
        sec = (sec < 10 ? "0" : "") + sec;
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        month = (month < 10 ? "0" : "") + month;
        var day = date.getDate();
        day = (day < 10 ? "0" : "") + day;
        return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;
    }

    function clearDatabase() {
        RSI.remove({}, function(err) {
            if (err) console.log("error clearing database!");
            else console.log('collection cleared');
        });
    }
}

