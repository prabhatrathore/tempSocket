const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const path = require("path");
const orderBookRoutes = require("./routes/orderBookRoutes");
const { getORderPendingBookData } = require("./controllers/orderBookController");
// const socketIoLogic = require("./helper/socketio");

const app = express();
const port = 5001;

const server = http.createServer(app);
// socketIoLogic(server);

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(express.json({ limit: "500mb" }));
// app.use(express.urlencoded({ limit: "500mb", extended: true }));

app.get("/", (req, res) => {
  // res.json({messge:"hello wolrd",success:true})
  res.sendFile(path.resolve(__dirname, "client", "index.html"));
});

app.get("/hello", (req, res) => {
  res.json({ message: "hellooo " });
});

app.use(express.static(path.resolve(__dirname, "client")));
// app.use("/orderBook", orderBookRoutes);

server.listen(port, async () => {
  console.log(`Server is listening on port ${port}`);
  await getORderPendingBookData();
});

module.exports = { server };





















// const express = require("express");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const http = require("http");
// const path = require("path");
// const socketIo = require("socket.io");
// const {
//   fetchData,
//   getResultObject,
// } = require("./controllers/instrumentController");

// const orderBookRoutes = require("./routes/orderBookRoutes");
// const {
//   getORderPendingBookData,
// } = require("./controllers/orderBookController");

// const app = express();
// const port = process.env.ENDPOINT_PORT || 5001;
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// // app.use(cors());
// app.use(express.json({ limit: "500mb" }));
// app.use(express.urlencoded({ limit: "500mb", extended: true }));


// app.get("/", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "client", "index.html"));
// });
// app.get("/hello", (req, res) => {
//   res.json({message:"hellooo "})
// });
// app.use(express.static(path.resolve(__dirname, "client")));

// app.use("/orderBook", orderBookRoutes);

// const server = http.createServer(app);
// const io = socketIo(server); // Initialize Socket.IO

// fetchData(io);

// // const corsOptions = {
// //   origin: 'http://localhost:3000', // Replace with your React app's URL
// //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
// // };

// // // Apply the CORS middleware to your Express app
// // app.use(cors(corsOptions));

// // io.origins("http://localhost:3000")

// io.on("connection", (socket) => {
//   socket.on("tokenData", async (token) => {
//     let findData;
//     let fetchdata = await getResultObject();
//     if (fetchdata[token]) {
//       findData = fetchdata[token];
//     }
//     if (findData) {
//       if (!socket.rooms.has("room" + token)) {
//         socket.emit("room" + token, "pass");
//         socket.join("room" + token);
//       }
//       socket.emit("room" + token, findData);
//       // io.to("room" + token).emit("room-"+token, findData);
//     } else {
//       socket.emit("dataFromToken", "Invalid token pass");
//     }
//   });

//   socket.on("unsubscribe", async (token) => {
//     socket.leave("room" + token);
//   });
// });


// server.listen(port, async () => {
//   console.log(`Server is listening on port ${port}`);
//   await getORderPendingBookData();
// });

// module.exports = { io };







