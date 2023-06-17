require('dotenv').config({ path: '../.env' });

const socketio = require("socket.io");
const express = require('express');
const http = require("http");
const app = express();
const server = http.createServer(app);

const {
    SERVER_PORT,
    CLIENT_PORT,
    DATABSE_PORT
} = process.env

const socketIo = socketio(server, {
    cors: {
        origin: "*",
    }
});
// nhớ thêm cái cors này để tránh bị Exception nhé :D  ở đây mình làm nhanh nên cho phép tất cả các trang đều cors được. 

socketIo.on("connection", (socket) => {
    console.log("New client connected" + socket.id);

    socket.emit("getId", socket.id);

    socket.on("sendDataClient", function (data) {
        socketIo.emit("sendDataServer", { data });
    })

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});


server.listen(SERVER_PORT, () => {
    console.log(`Server running at http://localhost:${SERVER_PORT}/`);
});
