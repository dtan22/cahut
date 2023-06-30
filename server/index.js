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

const {
    SERVER_PORT,
    CLIENT_PORT,
    DATABSE_PORT
} = process.env

app.use(cors())
app.use(express.json())
app.use(bodyparser.urlencoded({ extended: false }))

const db = require("./db")

async function validatePIN(pinNumber) {
    const QuestionSet = db.questionSet
    const questionSet = await QuestionSet.findOne({
        where: {
            pinNumber: pinNumber,
            state: "open"
        }
    })
    if (questionSet) {
        return true
    }
    return false
}

async function getQuestion(pinNumber, questionNumber) {
    const Question = db.question
    const question = await Question.findOne({
        where: {
            pinNumber: pinNumber,
            questionNumber: questionNumber
        }
    })
    return question
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

    socket.on(messages.CLIENT_HOST_SHOW_STAT, (data) => {
        const { pinNumber } = data
        console.log(data)
        socketIo.to(pinNumber).emit(messages.SERVER_SHOW_STAT, data)
    })

    socket.on(messages.CLIENT_HOST_NEXT_QUESTION, async (data) => {
        const { pinNumber, questionNumber } = data
        const question = await getQuestion(pinNumber, questionNumber)
        socketIo.to(pinNumber).emit(messages.SERVER_QUESTION_START, { question: question })
        setTimeout(() => {
            socketIo.to(pinNumber).emit(messages.SERVER_QUESTION_END)
        }, 10000)
    })

    socket.on(messages.CLIENT_HOST_END, (data) => {
        const { pinNumber } = data
        socketIo.to(pinNumber).emit(messages.SERVER_GAME_END)
    })

    socket.on(messages.CLIENT_PLAYER_JOIN, (data) => {
        const { pinNumber, name } = data
        if (validatePIN(pinNumber)) {
            console.log("Player joined: " + socket.id)
            socket.join(pinNumber)
            socketIo.to(pinNumber + '-host').emit(messages.SERVER_PLAYER_JOIN, { name: name, id: socket.id })
        }
    })

    socket.on(messages.CLIENT_PLAYER_ANSWER, (data) => {
        const { pinNumber, answer, name } = data
        socketIo.to(pinNumber + '-host').emit(messages.SERVER_PLAYER_ANSWER, { id: socket.id, answer: answer, name: name })
    })

    socket.on(messages.CLIENT_ENTER_CHAT, (data) => {
        const { pinNumber } = data
        if (validatePIN(pinNumber)) {
            console.log("Client enter chat: " + socket.id)
            socket.join(pinNumber + "-chat")
        }
    })

    socket.on(messages.CLIENT_SEND_CHAT_MESSAGE, (data) => {
        const { message, id, pinNumber, name } = data
        socketIo.to(pinNumber + "-chat").emit(messages.SERVER_SEND_CHAT_MESSAGE, { message, id, name })
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

app.use(require('./routes/user.route'));
app.use(require('./routes/question.route'));
app.use(require('./routes/questionSet.route'));