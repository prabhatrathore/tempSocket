const { instrumentModel } = require("../models/instrumentModal");
const { orderBookModel } = require("../models/orderBookModel");
const {exec}=require("child_process")
let pendingORderBookData = {};
let executionTokenStack= new Set();

exports.getORderPendingBookData = async () => {
  try {
    let fetchAllToken = await instrumentModel.findAll({
      attributes: ["token"],
      raw: true,
    });
    let finalObj = {};
    for (let el of fetchAllToken) {
      let findAllOrderdata = await orderBookModel.findAll({
        where: { status: "pending", token: el.token },
        raw: true,
      });

      if (!finalObj[el.token]) {
        finalObj[el.token] = {
          buy_orders: [],
          sell_orders: [],
        };
      }
      for (let order of findAllOrderdata) {
        if (order.type === "buy") {
          finalObj[el.token].buy_orders.push(order);
        } else if (order.type === "sell") {
          finalObj[el.token].sell_orders.push(order);
        }
      }
    }
    pendingORderBookData = finalObj;
    // console.log(JSON.stringify(pendingORderBookData), "objeccttttttttttttt");
  } catch (err) {
    console.log(err, "Erroro");
  }
};

exports.addOrderData = (req, res) => {
  try {
    const { token, type } = req.body;

    if (type === "buy" || type === "sell") {
      pendingORderBookData[token][`${type}_orders`].push(req.body);
    } else {
        res.status(400).json({message:"err occured",sucess:false})
      console.log("Invalid order type:", type);
    }
    // console.log(pendingORderBookData, "objectttttttttt");
    res
      .status(200)
      .json({ message: "Add successfully", data: pendingORderBookData });
  } catch (err) {
    res.status(500).json({ message: "err", err });
    console.log(err, "erro addOrderData");
    return 
}
};

exports.deleteObjectFromPEndingData = (req, res) => {
  try {
    const { token, type, id } = req.body;

    if (!pendingORderBookData[token]) {
      res.status(400).json({ message: "Token not found", success: false });
      return;
    }
    const updatedOrders = pendingORderBookData[token][`${type}_orders`].filter(
      (order) => order.id !== id
    );
    //   console.log(updatedOrders,"updatedOrders")
    pendingORderBookData[token][`${type}_orders`] = updatedOrders;

    //   console.log(
    //     updatedOrders,
    //     "Updated orders after deletion",
    //     pendingORderBookData
    //   );

    res.status(200).json({
      message: "Delete successfully",
      success: true,
      pendingORderBookData,
    });
  } catch (err) {
    res.status(500).json({ message: "Error", success: false, error: err });
  }
};
//function  
exports.filterDataAccordingToBidPriceAskPrice = async (bid_price,ask_price,token) => {
  try {
    if(executionTokenStack.has(token)){
        return;
    }
    executionTokenStack.add(token);
    // const { bid_price, ask_price, token } = req.body;
    // let tempArr = [];
    let tempObj = pendingORderBookData[token];
    let buy_order_array = tempObj["buy_orders"];
    let sell_order_array = tempObj["sell_orders"];
    let tempBuyOrderArray = [];
    let tempSellOrderArray = [];
    for (let el of buy_order_array) {
      if (el.order_type == "limit" && el.price >= ask_price) {
        // tempArr.push(el);
        tempBuyOrderArray.push(el.id);
      }
      if (el.order_type == "stoploss" && el.price <= ask_price) {
        // tempArr.push(el);
        tempBuyOrderArray.push(el.id);
      }
    }
    if (pendingORderBookData[token] && pendingORderBookData[token].buy_orders) {
      updatedOrders = pendingORderBookData[token].buy_orders.filter(
        (order) => !tempBuyOrderArray.includes(order.id)
      );
      pendingORderBookData[token].buy_orders = updatedOrders;
    }

    for (let el of sell_order_array) {
      if (el.order_type == "limit" && el.price <= bid_price) {
        // tempArr.push(el);
        tempSellOrderArray.push(el.id);
      }
      if (el.order_type == "stoploss" && el.price >= bid_price) {
        // tempArr.push(el);
        tempSellOrderArray.push(el.id);
      }
    }

    if (
      pendingORderBookData[token] &&
      pendingORderBookData[token].sell_orders
    ) {
      const updatedOrders = pendingORderBookData[token][`sell_orders`].filter(
        (order) => !tempSellOrderArray.includes(order.id)
      );
      pendingORderBookData[token][`sell_orders`] = updatedOrders;
    }
    

let finalArr=JSON.stringify([...tempBuyOrderArray,...tempSellOrderArray]);
if(tempBuyOrderArray.length || tempSellOrderArray.length){
exec(`php artisan make:controller ${finalArr}`,(err,)=>{
  executionTokenStack.delete(token);
});
}else{
  executionTokenStack.delete(token);
}


    // return res.status(200).json({
    //   message: "Fetch data successfully",
    //   data: tempArr,
    //   pendingORderBookData,
    // });
  } catch (err) {
    console.log(err,"error in filtering data")
    return;
    // res.status(500).json({ message: "err", err });
  }
};

exports.pendingORderBookData=()=>pendingORderBookData