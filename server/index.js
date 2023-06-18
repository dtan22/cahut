require('dotenv').config({ path: '../.env' })

const socketio = require("socket.io")
const express = require('express')
const bodyparser = require('body-parser')
const http = require("http")
const fs = require('fs')
const cors = require('cors')

const messages = JSON.parse(fs.readFileSync("../constants/messages.json"))

const app = express()
const server = http.createServer(app)

function validatePIN(pinNumber) {
    // TODO: validate pin number
    return pinNumber == "1234" || pinNumber == "4321"
}

const {
    SERVER_PORT,
    CLIENT_PORT,
    DATABSE_PORT
} = process.env

app.use(cors())
app.use(express.json())
app.use(bodyparser.urlencoded({ extended: false }))

const tempQuestions = [
    {
        question: "What is the capital of India?",
        options: ["Delhi", "Mumbai", "Kolkata", "Chennai"],
        answerIndex: 0
    },
    {
        question: "What is the capital of USA?",
        options: ["New York", "Washington DC", "Los Angeles", "Chicago"],
        answerIndex: 1
    }
]

function getQuestion(pinNumber, questionIndex) {
    // TODO: get question from database
    return tempQuestions[questionIndex]
}

const socketIo = socketio(server, {
    cors: {
        origin: "*",
    }
})

socketIo.on("connection", (socket) => {
    console.log("New client connected, id: " + socket.id)

    socket.emit(messages.SERVER_SEND_ID, socket.id)

    socket.on(messages.CLIENT_HOST_WAIT, (data) => {
        const { pinNumber } = data
        socket.join(pinNumber)
        socket.join(pinNumber + "-host")
    })

    socket.on(messages.CLIENT_HOST_NEXT_QUESTION, (data) => {
        const { pinNumber, questionIndex } = data
        const question = getQuestion(pinNumber, questionIndex)
        socket.to(pinNumber).emit(messages.SERVER_QUESTION_START, { question, questionIndex })
        setTimeout(async () => {
            const data = await getTurnStatistics(pinNumber, questionIndex)
            socket.to(pinNumber).emit(messages.SERVER_QUESTION_END, data)
        }, 10000)
    })

    socket.on(messages.CLIENT_HOST_END, (data) => {
        const { pinNumber } = data
        socket.to(pinNumber).emit(messages.SERVER_GAME_END)
    })

    socket.on(messages.CLIENT_PLAYER_JOIN, (data) => {
        const { pinNumber } = data
        if (validatePIN(pinNumber)) {
            socket.join(pinNumber)
            socket.emit(messages.SERVER_JOIN_RESPONSE, { success: true, message: "successful", pinNumber: pinNumber })
        } else {
            socket.emit(messages.SERVER_JOIN_RESPONSE, { success: false, message: "unsuccessful" })
        }
    })

    socket.on(messages.CLIENT_PLAYER_ANSWER, (data) => {
        const { pinNumber, questionIndex, answerIndex } = data
        const question = getQuestion(pinNumber, questionIndex)
        socket.to(pinNumber).emit(messages.SERVER_PLAYER_ANSWER, { correct: answerIndex == question.answerIndex })
    })

    socket.on(messages.CLIENT_SEND_CHAT_MESSAGE, function (data) {
        const { message, id, pinNumber } = data
        console.log(data)
        socketIo.to(pinNumber).emit(messages.SERVER_SEND_CHAT_MESSAGE, { message, id })
    })

    socket.on("disconnect", () => {
        console.log("Client disconnected")
    })
})


server.listen(SERVER_PORT, () => {
    console.log(`Server running at http://localhost:${SERVER_PORT}/`)
})

app.post('/player-join', (req, res) => {
    try {
        const { pinNumber } = req.body
        if (validatePIN(pinNumber)) {
            res.status(200).send({ success: true, message: "successful.", pinNumber: pinNumber })
        } else {
            res.status(200).send({ success: false, message: "no such PIN number exists." })
        }
    } catch (error) {
        res.status(500).send({ success: false, message: error.message })
    }
})