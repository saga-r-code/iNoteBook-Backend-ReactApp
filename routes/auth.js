const express = require("express");
const Users = require("../models/Users");
const router = express.Router(); //express router create
const { body, validationResult } = require("express-validator"); //this pakage for valid info

//Create User using: POST "/api/auth/createuser". doen't require authentication
router.post("/createuser",
  [//validation add
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be at least 8 characters").isLength({
      min: 8,
    }),
  ],
  async (req, res) => {
    //Vaildation error check
    const errors = validationResult(req);
    if (!errors.isEmpty()) { //if error than return message and status
      return res.status(400).json({ errors: errors.array() });
    }

    //this block of code create a new user in database 
    let user = await Users.findOne({email: req.body.email}) //return promise and find email if already exist than return else create new user
    console.log(user)
    if(user){
      return res.status(400).json({error : "this email is already exist"})
    }
     user = await Users.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    })


      // .then((user) => res.json(user))
      // .catch((err) => {
      //   console.log(err);
      //   res.json({ error: "please add unique value in email",message: err.message,})
      // });
  
    console.log(req.body);//show in console for debugging purpose
    res.send(req.body);
  }
);

module.exports = router;
