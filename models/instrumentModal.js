// const dbConn = require('../config/db.config')
// const {Sequelize, DataTypes} = require("sequelize");

// const instrumentModel = dbConn.define('instrument', {
//     token: DataTypes.TEXT,
//     instrument_identifier : DataTypes.TEXT,
//   symbol: DataTypes.STRING,
//   trading_symbol: DataTypes.STRING,
//   lotsize: DataTypes.STRING,
//   ltp: DataTypes.TEXT,
//   percentage_change: DataTypes.TEXT,
//   volume: DataTypes.INTEGER,
//   currency: DataTypes.INTEGER,
//   open_price: DataTypes.INTEGER,
//   high_price: DataTypes.INTEGER,
//   low_price: DataTypes.INTEGER,
//   close_price: DataTypes.INTEGER,
//   bid_price: DataTypes.INTEGER,
//   ask_price: DataTypes.INTEGER,
//   exchange: DataTypes.INTEGER,
//   segment: DataTypes.STRING,
//   expiry: DataTypes.STRING,
//   strike_price: DataTypes.STRING,
//   option_type: DataTypes.STRING,
//   upper_circuit: DataTypes.STRING,
//   lower_circuit : DataTypes.STRING,
//   pre_bid_price: DataTypes.STRING,
//   pre_ask_price: DataTypes.STRING,
//   tick_size: DataTypes.STRING,
 
//   }, {
//     tableName: 'instrument', // Set the table name explicitly
//     timestamps: false,  // Disable timestamps (created_at and updated_at columns)
//   });

//   module.exports = {
//     instrumentModel
//   };
