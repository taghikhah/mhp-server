var WebSocket = require("ws");

var socket = new WebSocket("ws://192.168.0.132:9001");

// On Open
socket.onopen = function (e) {
  console.log("[open] Connection established");
  console.log("Sending to server");
  let i = 0;
  while (i < 100) {
    let text = "The number is " + i;
    socket.send(text);
    console.log("writes: ", i);
    i++;
  }
};

// On Messsage
socket.onmessage = function (event) {
  console.log(`[message] Data received from server: ${event.data}`);
};

// On Close
socket.onclose = function (event) {
  if (event.wasClean) {
    console.log(
      `[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`
    );
  } else {
    // e.g. server process killed or network down
    // event.code is usually 1006 in this case
    console.log("[close] Connection died");
  }
};

module.exports = { onopen, onclose, onmessage };
