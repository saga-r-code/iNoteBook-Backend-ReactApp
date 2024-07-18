const express = require('express')
const mongoose = require('mongoose')

const app = express()

//Mongoose Connect to Database
mongoose.connect('mongodb://localhost:27017/')

app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))


app.get("/" , (req,res) =>{
    res.send("hello json")
})

app.listen(3000, ()=>{
    console.log("server is running ")
})

