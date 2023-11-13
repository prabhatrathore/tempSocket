const { strict } = require("assert");
const { instrumentModel } = require("../instruments/model");
const { orderBookModel } = require("./model");
const {exec}=require("child_process")
let pendingOrderBookData = {};
let executionTokenStack= new Set();

exports.getOrderPendingBookData = async () => {
  try {
    let fetchAllToken = await instrumentModel.findAll({
      attributes: ["token"],
      raw: true,
    });
    let finalObj = {};
    // let findAllOrderdata = null;
    for (let el of fetchAllToken) {
        let findAllOrderdata = await orderBookModel.findAll({
        where: { status: "pending", token: el.token },
        raw: true});

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
    pendingOrderBookData = finalObj;
    // console.log(JSON.stringify(pendingOrderBookData), "objeccttttttttttttt");
  } catch (err) {
    console.log("Error in getOrderPendingBookData", err);
  }
};

exports.addOrderData = (req, res) => {
  try {
    const { token, type } = req.body;

    if (type === "buy" || type === "sell") {
      pendingOrderBookData[token][`${type}_orders`].push(req.body);
    } else {
        res.status(400).json({message:"err occured",sucess:false})
      console.log("Invalid order type:", type);
    }
    // console.log(pendingOrderBookData, "objectttttttttt");
    res
      .status(200)
      .json({ message: "Add successfully", data: pendingOrderBookData });
  } catch (err) {
    res.status(500).json({ message: "Error", success: false, error: err });
    console.log("erro addOrderData", err);
    return 
}
};

exports.deleteObjectFromPEndingData = (req, res) => {
  try {
    const { token, type, id } = req.body;

    if (!pendingOrderBookData[token]) {
      res.status(400).json({ message: "Token not found", success: false });
      return;
    }
    const updatedOrders = pendingOrderBookData[token][`${type}_orders`].filter(
      (order) => order.id !== id
    );
    //   console.log(updatedOrders,"updatedOrders")
    pendingOrderBookData[token][`${type}_orders`] = updatedOrders;

    //   console.log(
    //     updatedOrders,
    //     "Updated orders after deletion",
    //     pendingOrderBookData
    //   );

    res.status(200).json({
      message: "Delete successfully",
      success: true,
      pendingOrderBookData,
    });
  } catch (err) {
    res.status(500).json({ message: "Error", success: false, error: err });
    console.log("erro deleteObjectFromPEndingData", err);
    return 
  }
};
//function  
exports.filterDataAccordingToBidPriceAskPrice = async (bid_price, ask_price, token) => {
  try {
    if(executionTokenStack.has(token)){
        return;
    }
    executionTokenStack.add(token);
    // const { bid_price, ask_price, token } = req.body;
    // let tempArr = [];
    let tempObj = pendingOrderBookData[token];
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
    if (pendingOrderBookData[token] && pendingOrderBookData[token].buy_orders) {
      let updatedOrders = pendingOrderBookData[token].buy_orders.filter(
        (order) => !tempBuyOrderArray.includes(order.id)
      );
      pendingOrderBookData[token].buy_orders = updatedOrders;
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
      pendingOrderBookData[token] &&
      pendingOrderBookData[token].sell_orders
    ) {
      const updatedOrders = pendingOrderBookData[token][`sell_orders`].filter(
        (order) => !tempSellOrderArray.includes(order.id)
      );
      pendingOrderBookData[token][`sell_orders`] = updatedOrders;
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
    //   pendingOrderBookData,
    // });
  } catch (err) {
    console.log("error in filtering data", err)
    return;
    // res.status(500).json({ message: "err", err });
  }
};

exports.pendingOrderBookData=()=>pendingOrderBookData