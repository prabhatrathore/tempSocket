const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

const { host, port, user, password, database, socketpath } = process.env;
const dbConn = new Sequelize(database, user, password, {
  host: host,
  port: port,
  dialect: "mysql",
  dialectOptions: {
    socketPath: socketpath,
  },
  pool: {
    max: 15,
    min: 0,
    maxIdleTime: 1000,
    acquire: 30000000,
    idle: 100000000,
  },
  logging: false,
});

module.exports = dbConn;
