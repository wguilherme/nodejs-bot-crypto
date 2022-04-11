// log env
console.log('port', PORT)
const SYMBOL = "BTCBUSD";
const BINANCE_INTERVAL = "1m"
const WATCH_INTERVAL = 1000 * 60;
const axios = require("axios");

const credentials = {
  apiKey: "",
  apiSecret: ""
}



function calcRSI(closes) {
  const rsi = require('technicalindicators').RSI;
  const rsiResult = rsi.calculate({
    values: closes,
    period: 14
  });

  return rsiResult[rsiResult.length - 1];
}
async function process() {
  const response = await axios.get(`https://api.binance.com/api/v3/klines?symbol=${SYMBOL}&interval=${BINANCE_INTERVAL}`);
  const closes = response.data.map(candle => parseFloat(candle[4]));
  const rsi = calcRSI(closes);

  if (rsi > 70) {
    console.log(`${rsi} - BUY`);
    const binance = require('binance-api-node').default;

    const client = new binance({
      apiKey: credentials.apiKey,
      apiSecret: credentials.apiSecret,
      test: true
    });

    const order = await client.order({
      symbol: SYMBOL,
      side: 'BUY',
      type: 'MARKET',
      quantity: '0.1',

    });
    console.log(order);

  } else if (rsi < 30) {
    console.log(`${rsi} - SELL`);
    const binance = require('binance-api-node').default;
    const client = new binance({ apiKey: credentials.apiKey, apiSecret: credentials.apiSecret });
    const order = await client.order({
      symbol: SYMBOL,
      side: 'SELL',
      type: 'MARKET',
      quantity: '0.1'
    });
    console.log(order);
  } else {
    // console.log(`${rsi} - HOLD`);
  }
}
setInterval(process, WATCH_INTERVAL);
process();