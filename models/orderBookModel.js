// const dbConn = require("../config/db.config");
// const { Sequelize, DataTypes } = require("sequelize");

// const orderBookModel = dbConn.define(
//   "order_book",
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     token: DataTypes.TEXT,
//     trading_symbol: DataTypes.TEXT,

//     type: DataTypes.STRING,
//     qty: DataTypes.STRING,
//     client_id: DataTypes.STRING,

//     order_type: DataTypes.TEXT,
//     price: DataTypes.DOUBLE,
//     currency: DataTypes.STRING,
//     status: DataTypes.STRING,
//     from_ip_address: DataTypes.STRING,
//     from_custom_device_id: DataTypes.STRING,
//     added_on: DataTypes.DATE,
//   },
//   {
//     tableName: "order_book", // Set the table name explicitly
//     timestamps: false, // Disable timestamps (created_at and updated_at columns)
//   }
// );

// module.exports = {
//   orderBookModel,
// };
