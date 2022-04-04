const SYMBOL = "BTCBUSD";
const BINANCE_INTERVAL = "1m"
const WATCH_INTERVAL = 1000;

async function process() {
  const maxPrice = 36291
  const minPrice = 35764
  const axios = require("axios");
  const response = await axios.get(`https://api.binance.com/api/v3/klines?symbol=${SYMBOL}&interval=${BINANCE_INTERVAL}`);
  // get last position of array
  const candleLastPosition = response.data.length - 1;
  const candlePrice = parseFloat(candleLastPosition[4]);

  if (candlePrice >= maxPrice) console.log("Vender!");
  else if (candlePrice <= minPrice) console.log("Comprar!");
  else console.log("Aguardar...");
}

setInterval(process, WATCH_INTERVAL);

process();