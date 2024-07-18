const express = require("express");
const Users = require("../models/Users");
const router = express.Router();


//Create User using: POST "/api/auth". doen't require auth
router.post("/",async (req, res) => {
  res.send(req.body);
  const user = Users(req.body);
  await user.save()

  console.log(req.body)
});

module.exports = router;
