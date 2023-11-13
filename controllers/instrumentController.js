// const { instrumentModel } = require("../models/instrumentModal");
const WebSocket = require("ws");
const { filterDataAccordingToBidPriceAskPrice } = require("./orderBookController");
const { default: axios } = require("axios");
const fs = require('fs')

let instrumentsList = [];
let parsedData = {}
let resultObject = {};
fs.readFile('instrumentObject.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading JSON file:', err);
    return;
  }
  try {
    // console.log(data,"Datat2222222222222222222")
    parsedData = JSON.parse((data));
    resultObject = JSON.parse((data));
    // console.log(parsedData, "22222222Data");
    let arrayToken = Object.keys(parsedData)
    instrumentsList = arrayToken
    console.log(instrumentsList, "!@@@@@@@@@@@@@@@@@@@@@@@@@arrayToken")
  } catch (parseError) {
    console.error('Error parsing JSON:', parseError);
  }
})
let pingpongInterval;

let tokenDATaFromCLient2 = {};
console.log(instrumentsList, "Ppppppppppppppppppppppppppppppppppp")

export function wsConnect(io, tokenChunk) {
  let connectionCount = 0;
  const ws = new WebSocket(
    "wss://stream.globalmarketcap.org/socket/?access_token=r3am628r3a2d23v6a28nsf19am3u8nd8"
  );

  // function subscribe() {
  //   const msg = JSON.stringify({
  //     method: "subscribe",
  //     params: instrumentsList,
  //   });
  //   ws.send(msg);
  // }
  function subscribe(tokens) {
    const msg = JSON.stringify({
      method: "subscribe",
      params: tokens,
    });
    ws.send(msg);
  }

  function startHeartbeat() {
    pingpongInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send("ping");
        console.log("ping sent");
      }
    }, 25000);
  }

  ws.on("open", () => {
    console.log("Connection established!");
    if (ws.readyState === WebSocket.OPEN) {
      console.log("Connection is ready. Sending Subscription.");
      subscribe(tokenChunk);
      startHeartbeat();
    }
  });

  ws.on("message", async (data) => {
    const idata = await JSON.parse(data);
    const scriptId = idata.OpenInterestChange;
    // console.log("result object909",idata,"poopopopopo",idata.OpenInterestChange)
    if (idata.OpenInterestChange) {
      if (resultObject[idata.OpenInterestChange]) {
        resultObject[idata.OpenInterestChange].ltp = idata?.LastTradePrice;
        resultObject[idata.OpenInterestChange].percentage_change =
          idata?.PriceChangePercentage;
        resultObject[idata.OpenInterestChange].open_price = idata?.Open;
        resultObject[idata.OpenInterestChange].high_price = idata?.High;
        resultObject[idata.OpenInterestChange].low_price = idata?.Low;
        resultObject[idata.OpenInterestChange].close_price = idata?.Close;
        resultObject[idata.OpenInterestChange].bid_price = idata?.BuyPrice;
        resultObject[idata.OpenInterestChange].ask_price = idata?.SellPrice; //1 2 3 4 5 6
        io?.to("room" + idata.OpenInterestChange)?.emit(
          "room-" + idata.OpenInterestChange,
          resultObject[idata.OpenInterestChange]
        );
        filterDataAccordingToBidPriceAskPrice(idata?.BuyPrice, idata?.SellPrice, idata?.OpenInterestChange)
      }
    }
    console.log('Received message:', idata.OpenInterestChange);
  });

  ws.on("close", (code, reason) => {
    clearInterval(pingpongInterval);
    if (connectionCount < 50) {
      console.log(`WebSocket closed with code ${code}. Reconnecting...`);
      setTimeout(() => {
        wsConnect(io, tokenChunk);
      }, 1000);
    }
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
}

export const fetchData = async (io) => {
  try {
    const chunkSize = 800;
    const instrumentsListFetch = []
    //  await instrumentModel.findAll({
    //   attributes: ["token"],
    //   raw: true,
    // });
    // let arrayOfObject = await instrumentModel.findAll({
    //   attributes: [
    //     "token",
    //     "instrument_identifier",
    //     "symbol",
    //     "trading_symbol",
    //     "lotsize",
    //     "ltp",
    //     "percentage_change",
    //     "volume",
    //     "ltp",
    //     "percentage_change",
    //     "volume",
    //     "currency",
    //     "open_price",
    //     "high_price",
    //     "low_price",
    //     "close_price",
    //     "bid_price",
    //     "ask_price",
    //     "exchange",
    //     "segment",
    //     "expiry",
    //     "strike_price",
    //     "option_type",
    //     "upper_circuit",
    //     "lower_circuit",
    //     "pre_bid_price",
    //     "pre_ask_price",
    //     "tick_size",
    //   ],
    //   raw: true,
    // });
    // console.log(arrayOfObject, "arrOfObject323333333333 ")

    // resultObject = arrayOfObject.reduce((obj, item) => {
    //   obj[item.token] = item;
    //   return obj;
    // }, {});



    // let  tokens = instrumentsListFetch.map((item) => parseInt(item.token));

    // const totalTokens = tokens.length;
    // console.log(totalTokens,"totalTokenstotalTokenstotalTokenstotalTokens")
    // for (let start = 0; start < totalTokens; start += chunkSize) {
    //   const end = Math.min(start + chunkSize, totalTokens);
    //   const tokenChunk = tokens.slice(start, end);
    //   // wsConnect(io, tokenChunk);
    // }

    // instrumentsList = instrumentsListFetch.map((item) => parseInt(item.token));
    // if (instrumentsList.length > 0) {
    let instrumentsList = []
    instrumentsList = [
      154811,
      154645,
      155468,
      155518,
      154645,
      155468,
      155515,
      155468,
      155516,
      155518,
      155517,
      155515,
      154645,
      155519,
      154645,
      155518,
      155519,
      155516,
      155518,
      155519,
      155516,
      154811,
      154645,
      155468,
      155518,
      155519,
      155516,
      155515,]
    wsConnect(io, instrumentsList);
    // }
  } catch (err) {
    console.error(err, "error in fetching");
  }
};



async function fetchtokenAll() {
  let get = await axios.get("https://stream.globalmarketcap.org/home/allActiveScriptsWithGlobalV2")
  // console.log(get.data.data,"GEttttttttttttttttttttttt")

  // Extract the script_id values from the data array
  const scriptIds = get.data.data.map(item => item.script_id);

  console.log(JSON.stringify(scriptIds), 'scriptIdsscriptIdsscriptIdsscriptIdsscriptIdsscriptIds');

}
// fetchtokenAll()
export const getResultObject = () => resultObject;
export const  tokenDATaFromCLient = () => tokenDATaFromCLient2;
