const webSocketsServerPort = 4000;
const webSocketServer = require("websocket").server;
const http = require("http");
// Spinning the http server and the websocket server.
const server = http.createServer();
server.listen(webSocketsServerPort);

const wsServer = new webSocketServer({
  httpServer: server,
}); // I'm maintaining all active connections in this object
const clients = {};

wsServer.on("connection", function connection(connection) {
  console.log("connection");
  connection.on("message", function message(message) {
    console.log("message : " + message);
  });
});

// This code generates unique userid for everyuser.
const getUniqueID = () => {
  const s4 = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  return s4() + s4() + "-" + s4();
};

wsServer.on("request", function (request) {
  var userID = getUniqueID();
  console.log(
    new Date() +
      " Recieved a new connection from origin " +
      request.origin +
      "."
  );
  // You can rewrite this part of the code to accept only the requests from allowed origin
  const connection = request.accept(null, request.origin);
  clients[userID] = connection;
  console.log(
    "connected: " + userID + " in " + Object.getOwnPropertyNames(clients)
  );
});

exports.wsServer = wsServer;
// var WebSocket = require("ws");

// var socket = new WebSocket("ws:localhost:4000");

// // On Open
// socket.onopen = function (e) {
//   console.log("[open] Connection established");
//   console.log("Sending to server");
//   let i = 0;
//   while (i < 100) {
//     let text = "The number is " + i;
//     socket.send(text);
//     console.log("writes: ", i);
//     i++;
//   }
// };

// // On Messsage
// socket.onmessage = function (event) {
//   console.log(`[message] Data received from server: ${event.data}`);
// };

// // On Close
// socket.onclose = function (event) {
//   if (event.wasClean) {
//     console.log(
//       `[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`
//     );
//   } else {
//     // e.g. server process killed or network down
//     // event.code is usually 1006 in this case
//     console.log("[close] Connection died");
//   }
// };

// // module.exports = { onopen, onclose, onmessage };
// module.exports = socket;

// // exports.socket = socket;
