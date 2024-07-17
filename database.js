const express = require('express')
const mongoose = require('mongoose')

const app = express()

mongoose.connect('mongodb://localhost:27017/Crud')

const UserSchema =new mongoose.Schema({
    name : String,
    age : Number
})
 
const UserModel = mongoose.model("user", UserSchema)

app.get("/getUser", (req,res)=>{
    UserModel.find({}).then(function(users){
        res.json(users)
    }).catch(function(err){
        console.log(err)
    })
})

app.listen(3000, ()=>{
    console.log("server is running ")
})

