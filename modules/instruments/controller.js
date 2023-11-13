const { instrumentModel } = require("./model");
const {wsConnectCall} = require("./services");

const { default: axios } = require("axios");
const fs = require('fs')


let instrumentsList = [];
let parsedData={}
let resultObject = {};

fs.readFile('instrumentObject.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading JSON file: ', err);
    return;
  }
  try {
    // console.log(data,"Datat2222222222222222222")
     parsedData = JSON.parse((data));
     resultObject = JSON.parse((data));
     // Convert the object properties into an array of objects
    //  resultObject = Object.keys(data).map((key) => data[key]);
    //  console.log(resultObject.length);

    // console.log(parsedData, "22222222Data");
    let arrayToken=Object.keys(parsedData)
    instrumentsList=arrayToken
    // console.log("@arrayToken:   ", instrumentsList)
  } catch (parseError) {
    console.error('Error parsing JSON:  ', parseError);
  }
});

let tokenDATaFromCLient = {};
console.log("here is instrumentsList:   ", instrumentsList)



exports.fetchData = async (io) => {
  try {
    const chunkSize = 800;
    const instrumentsListFetch = await instrumentModel.findAll({
      attributes: ["token"],
      raw: true,
    });

    let  tokens = instrumentsListFetch.map((item) => parseInt(item.token));
  
    const totalTokens = tokens.length;
    console.log("totalTokens:   ", totalTokens);
    const tokenChunk = [];
    for (let start = 0; start < totalTokens; start += chunkSize) {
      const end = Math.min(start + chunkSize, totalTokens);
      tokenChunk.push(tokens.slice(start, end));
      // wsConnect(io, tokenChunk);
      wsConnectCall(io, tokens.slice(start, end), resultObject);
    }

    // tokenChunk.forEach(item => {
    //     if(item.length)
    //         wsConnectCall(io, item, resultObject);
    // });

  } catch (err) {
    console.error(err, "error in fetching");
  }
};




/*
async function fetchtokenAll(){
    let get=await  axios.get("https://stream.globalmarketcap.org/home/allActiveScriptsWithGlobalV2")
    // console.log(get.data.data,"GEttttttttttttttttttttttt")
        
    // Extract the script_id values from the data array
    const scriptIds = get.data.data.map(item => item.script_id);

    console.log(JSON.stringify(scriptIds),'scriptIdsscriptIdsscriptIdsscriptIdsscriptIdsscriptIds');

}
*/
// fetchtokenAll()
exports.getResultObject = () => resultObject;
exports.tokenDATaFromCLient = () => tokenDATaFromCLient;
