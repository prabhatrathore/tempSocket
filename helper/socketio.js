const socketIo = require("socket.io");
const { fetchData, getResultObject } = require("../controllers/instrumentController");

module.exports = (server) => {
  const io = socketIo(server);
  fetchData(io);
  
  io.on("connection", (socket) => {
    socket.on("tokenData", async (token) => {
      let findData;
      let fetchdata = await getResultObject();
      if (fetchdata[token]) {
        findData = fetchdata[token];
      }

      if (findData) {
        if (!socket.rooms.has("room" + token)) {
          socket.emit("room" + token, "pass");
          socket.join("room" + token);
        }
        socket.emit("room" + token, findData);
      } else {
        socket.emit("dataFromToken", "Invalid token pass");
      }
    });
    socket.on("unsubscribe", async (token) => {
      socket.leave("room" + token);
    });
  });

};
