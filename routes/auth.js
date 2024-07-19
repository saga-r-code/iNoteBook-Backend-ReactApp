const express = require("express");
const Users = require("../models/Users");
const router = express.Router();
const { body, validationResult } = require('express-validator');


//Create User using: POST "/api/auth". doen't require auth
router.post("/",[
  body('name', 'Enter a valid name').isLength({ min: 3 }),
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password must be at least 8 characters').isLength({ min:8 })
],(req, res) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()})
  }
  Users.create({
    name:req.body.name,
    email:req.body.email,
    password:req.body.password,
  }).then(user => res.json(user))
  .catch(err =>{
    console.log(err)
    res.json({error: "please add unique value in email", message: err.message})
  })
  
  console.log(req.body)
  // res.send(req.body);
});

module.exports = router;
