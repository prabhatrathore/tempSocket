const fs = require('fs')
const WebSocket = require("ws");
const { filterDataAccordingToBidPriceAskPrice } = require("../orderBook/controller");
let pingpongInterval;

let resultObject = {};
// let finalResult = {};

let connectionCount = 0;
const maxConnectionAttempts = 20;
const initialReconnectDelay = 1000; // Initial delay in milliseconds
let reconnectDelay = initialReconnectDelay;


exports.wsConnectCall = (io, tokenChunk, data)=>{
    resultObject = data;
    if (connectionCount < maxConnectionAttempts) {
      setTimeout(() => {
        wsConnect(io, tokenChunk);
        connectionCount++;
        reconnectDelay *= 2; // Exponential backoff
      }, reconnectDelay);
    } else {
      console.log("Exceeded maximum reconnection attempts.");
    }
    // wsConnect(io, tokenChunk)
}

let wsConnect = (io,tokenChunk)=> {

    let connectionCount = 0;
    let ws = new WebSocket(
      "wss://stream.globalmarketcap.org/socket/?access_token=r3am628r3a2d23v6a28nsf19am3u8nd8"
    );
  
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
      try{
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

          filterDataAccordingToBidPriceAskPrice(idata?.BuyPrice,idata?.SellPrice,idata?.OpenInterestChange)
        }
      }
      console.log('Received message:', idata.OpenInterestChange);

    }catch(e){
      console.log(e);
    }
    });
  
    ws.on("close", (code, reason) => {
        // console.log(resultObject.length);
        clearInterval(pingpongInterval);
        if (connectionCount < 50) {
            console.log(`WebSocket closed with code ${code}. Reconnecting...`);
            setTimeout(() => {
            wsConnect(io,tokenChunk);
            }, 1000);
        }
    });
  
    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
    });
  }

//   exports.wsConnect=()=>wsConnect


function saveResultObjectToFile() {
  const resultJson = JSON.stringify(resultObject, null, 2);

  fs.writeFile("instrumentObject.json", resultJson, (err) => {
    if (err) {
      console.error('Error saving resultObject to file:', err);
    } else {
      console.log('resultObject saved to file successfully.');
    }
  });
}

// Schedule saving every minute (60,000 milliseconds)
const saveInterval = 150; // 60 seconds * 1000 milliseconds
setInterval(saveResultObjectToFile, saveInterval);