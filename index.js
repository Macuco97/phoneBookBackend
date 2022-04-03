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

const getAllData = (req, res) => {
    connection.query('SELECT * FROM Phonebook', (err, rows, fields) => {
       
        if (!err) {
            rows.forEach( rows => {
                let newRowFotoToStringBase64 = Buffer.from(rows.foto, "base64").toString()
                rows.foto = newRowFotoToStringBase64
            })
            res.send({rows: rows, fields: fields})
        }
        else {
            console.log('Linha 32', 'Error performing query' + err )
        }
    })
}


app.get('/', (req, res) => {
    getAllData(req, res)
})


app.post('/' , upload.single('foto') , (req, res) => {
    const { nome, telefone, email } = req.body
    const foto = req.file.buffer.toString('base64')
    const sqlInsertSintaxy = "INSERT INTO Phonebook (foto, nome, telefone, email) VALUES (?)"
    const insertValues = [[foto, nome, telefone, email]]
    connection.query(sqlInsertSintaxy, insertValues, (err, result, field) => {
        if(err) {
            console.log(err)
        }
        else {
            getAllData(req, res)
        }
    })
    
    }   
)

app.delete('/', (req, res)=> {
    const { telefone } = req.body
    const sqlDeleteSintaxy = "DELETE FROM Phonebook WHERE telefone = (?)"
    connection.query(sqlDeleteSintaxy, telefone, err => {
        if(err) {
            console.log(err)
        }
        else{
            getAllData(req, res)
        }
    })
})

app.put('/', upload.single('photo') , (req,res) => {
    const newValue = req.file ? req.file.buffer.toString('base64') : req.body.newValue
    const { lineKey, lineChange} = req.body
    const sqlUpdateSintaxy = `UPDATE Phonebook SET ${lineChange} = '${newValue}' WHERE (telefone = '${lineKey}')`
    connection.query(sqlUpdateSintaxy, err => {
        if(err) {
            console.log('linha 86', err)
        }
        else{
            getAllData(req, res)
        }

    })
})

app.listen(PORT || 3001, ()=> {
    console.log('Running on Port 3001')
})