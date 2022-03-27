const express = require('express')
const app = express()
const mysql = require('mysql')
const cors = require('cors')
const multer = require('multer')
const upload = multer()
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
            rows.forEach( rows => {
                let newRowFotoToStringBase64 = Buffer.from(rows.foto, "base64").toString()
                rows.foto = newRowFotoToStringBase64
            })
            console.log(rows)
            /*let row = Buffer.from(rows[0].foto, "base64").toString()
            console.log('linha 26', row)
            rows[0].foto = row*/
            res.send({rows: rows, fields: fields})
        }
        else {
            console.log('Erro ao realizar consulta ' + err )
        }
    })
})
-
app.post('/' , upload.single('foto') , (req, res) => {
    const { nome, telefone, email } = req.body
    const foto = req.file.buffer.toString('base64')
    console.log('linha 36', foto)
    const sqlInsertSintaxy = "INSERT INTO Phonebook (foto, nome, telefone, email) VALUES (?)"
    const insertValues = [[foto, nome, telefone, email]]
    connection.query(sqlInsertSintaxy, insertValues, err => {
        console.log('linha 42', err)
    })
    connection.query('SELECT * FROM Phonebook', (err, rows, fields) => {
        if (!err) {
            res.send({rows: rows, fields: fields}) 
        }
        else {
            console.log('Erro ao realizar consulta ' + err )
        }
    })
    }   
)

app.delete('/', (req, res)=> {
    const { telefone } = req.body
    const sqlDeleteSintaxy = "DELETE FROM Phonebook WHERE telefone = (?)"
    connection.query(sqlDeleteSintaxy, telefone, err => {
        console.log('linha 59', err)
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
        console.log('linha 69', err)
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