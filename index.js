const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()
const { HOST, USERS, PASSWORD, DATABASE }  = process.env

console.log(HOST, USERS, PASSWORD, DATABASE)

app.use(cors())

commit e6870b87efd38e99b421f51b190ba0e286393583
Author: Raphae <raphae@pop-os.localdomain>
Date:   Fri Feb 25 09:48:43 2022 -0300

    Database parameters set in dotenv and passed to index