require('dotenv').config({ path: '../.env' });
const express = require('express')

const app = express()

const {
    SERVER_PORT,
    CLIENT_PORT,
    DATABSE_PORT
} = process.env

app.get('/', (req, res) => {
    res.send('hello from server!')
})

app.listen(SERVER_PORT, () => {
    console.log(`App listening on port ${SERVER_PORT}`)
})
