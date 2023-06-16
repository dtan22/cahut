require('dotenv').config({ path: '../.env' });

const socketio = require("socket.io");
const express = require('express');
const bodyparser = require('body-parser');
const http = require("http");
const fs = require('fs');
const cors = require('cors');

const messages = JSON.parse(fs.readFileSync("../constants/messages.json"));

const app = express();
const server = http.createServer(app);

const {
    SERVER_PORT,
    CLIENT_PORT,
    DATABSE_PORT
} = process.env

app.use(cors());
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: false }));

const socketIo = socketio(server, {
    cors: {
        origin: "*",
    }
});

socketIo.on("connection", (socket) => {
    console.log("New client connected, id: " + socket.id);

    socket.emit(messages.SERVER_SEND_ID, socket.id);

    socket.on(messages.CLIENT_HOST_JOIN, (data) => {
        const { pinNumber } = data;
        socket.join(pinNumber);
        socket.join(pinNumber + "-host");
        if (pinNumber == "1234") {
            socket.emit(SERVER_JOIN_RESPONSE, { success: true, message: "successful" })
        } else {
            socket.emit(SERVER_JOIN_RESPONSE, { success: false, message: "unsuccessful" })
        }
    });

    socket.on(messages.CLIENT_PLAYER_JOIN, (data) => {
        const { pinNumber } = data;
        if (pinNumber == "1234") {
            socket.join(pinNumber);
            socket.emit(messages.SERVER_JOIN_RESPONSE, { success: true, message: "successful", pinNumber: pinNumber })
        } else {
            socket.emit(messages.SERVER_JOIN_RESPONSE, { success: false, message: "unsuccessful" })
        }
    });

    socket.on(messages.CLIENT_SEND_CHAT_MESSAGE, function (data) {
        const { message, id, pinNumber } = data;
        console.log(data)
        socketIo.to(pinNumber).emit(messages.SERVER_SEND_CHAT_MESSAGE, { message, id });
    })

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});


server.listen(SERVER_PORT, () => {
    console.log(`Server running at http://localhost:${SERVER_PORT}/`);
});

app.post('/player-join', (req, res) => {
    try {
        const { pinNumber } = req.body;
        if (pinNumber == "1234") {
            res.status(200).send({ success: true, message: "successful.", pinNumber: pinNumber });
        } else {
            res.status(200).send({ success: false, message: "no such PIN number exists." });
        }
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
});