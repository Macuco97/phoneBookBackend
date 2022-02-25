const express = require('express')
const cors = require('cors')
const app = express()
const { HOST, USERS, PASSWORD, DATABASE} = process.env

console.log(HOST, USERS, PASSWORD, DATABASE)

app.use(cors())