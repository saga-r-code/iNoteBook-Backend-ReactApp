const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');

const app = express()
const port = process.env.PORT || 5000;
app.use(cors()); // Enable CORS for all origins

//Mongoose Connect to Database
mongoose.connect('mongodb://localhost:27017/inotebook')

app.use(express.json())

//Api hit and available routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

//first page show "hello json" in web page
app.get("/" , (req,res) =>{
    res.send("hello json")
})

//run on 5000 localhost
app.listen(port, ()=>{
    console.log(`iNotebook backend server is running on http://localhost:${port}/ `)
})

