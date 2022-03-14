const express = require('express')
const app = express()
const mysql = require('mysql')
const cors = require('cors')
require('dotenv').config()
app.use(cors())
app.use(express.json())
const {HOST, USERS, PASSWORD, DATABASE, PORT} = process.env

const connection = mysql.createPool({
    connectionLimit: 2,
    host: HOST,
    user: USERS,
    password: PASSWORD,
    database: DATABASE,
})


app.get('/', (req, res) => {
    connection.query('SELECT * FROM Phonebook', (err, rows, fields) => {
       
        if (!err) {
                 res.send({rows: rows, fields: fields})
        }
        else {
            console.log('Erro ao realizar consulta ' + err )
        }
    })
})

app.post('/', (req, res) => {
    const {foto, nome, telefone, email} = req.body
    const sqlInsertSintaxy = "INSERT INTO Phonebook (foto, nome, telefone, email) VALUES (?)"
    const insertValues = [[foto, nome, telefone, email]]
    connection.query(sqlInsertSintaxy, insertValues, err => {
        console.log(err)
    })
    connection.query('SELECT * FROM Phonebook', (err, rows, fields) => {
       
        if (!err) {
            res.send({rows: rows, fields: fields}) 
        }
        else {
            console.log('Erro ao realizar consulta ' + err )
        }
    })
})

app.delete('/', (req, res)=> {
    const { telefone } = req.body
    const sqlDeleteSintaxy = "DELETE FROM Phonebook WHERE telefone = (?)"
    connection.query(sqlDeleteSintaxy, telefone, err => {
        console.log(err)
    })
    connection.query('SELECT * FROM Phonebook', (err, rows, fields) => {
       
        if (!err) {
            res.send({rows: rows, fields: fields}) 
        }
        else {
            console.log('Erro ao realizar consulta ' + err )
        }
    })
})

app.put('/', (req,res) => {
    const {newValue, lineKey, lineChange} = req.body
    const sqlUpdateSintaxy = `UPDATE Phonebook SET ${lineChange} = '${newValue}' WHERE (telefone = '${lineKey}')`
    connection.query(sqlUpdateSintaxy, err => {
        console.log(err)
    })
    connection.query('SELECT * FROM Phonebook', (err, rows, fields) => {
       
        if (!err) {
            res.send({rows: rows, fields: fields}) 
        }
        else {
            console.log('Erro ao realizar consulta ' + err )
        }
    })
})

app.listen(PORT || 3001, ()=> {
    console.log('Running on Port 3001')
})