
const express = require("express");
const Users = require("../models/Users");
const router = express.Router(); //express router create
const { body, validationResult } = require("express-validator"); //this pakage for valid info
const bcrypt = require("bcryptjs"); //this pakage for hash password
const jwt = require("jsonwebtoken"); //this pakage for generate token
const User = require("../models/Users");

const JWT_SAFFKEY = 'Sagee$plash' // this is secrate key for the sign in

//Create User using: POST "/api/auth/createuser". doen't require authentication
router.post(
  "/createuser",
  [
    //validation add
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be at least 8 characters").isLength({min: 8,}),
  ],
  async (req, res) => {
    //Vaildation error check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //if error than return message and status
      return res.status(400).json({ errors: errors.array() });
    }

    //this block of code create a new user in database and check the user email are exist or not
    try {
      let user = await Users.findOne({ email: req.body.email }); //return promise and find email 
      console.log(user); // show the if already exist than console object of that user otherwise console null
      if (user) { //if already exist than return otherwise create new user
        return res.status(400).json({ error: "this email is already exist" });
      }

      const salt = await bcrypt.genSalt(10) //genrating salt
      const safePass = await bcrypt.hash(req.body.password, salt); //return promises genrating hash 
      // console.log(safePass)

      //create new user when if condition false
      user = await Users.create({
        name: req.body.name,
        email: req.body.email,
        password: safePass,
      });

      const data ={//  the payload for the JWT with additional claims and data is encode throgh "jwt"
        user:{
          id: user.id,
        }
    }
      const token  = jwt.sign(data, JWT_SAFFKEY) //jwt.sign() get two param data is payload  and JWT Key is safe key sign is for the authenticity
      // token is already synchronous that means doesn't require promises
      // res.json({token})  //token as json formate send // error show
      // console.log(token)
     

      console.log(req.body); //show in console for debugging purpose
      res.send({response: req.body, output: token});
       // .then((user) => res.json(user))
      // .catch((err) => {
      //   console.log(err);
      //   res.json({ error: "please add unique value in email",message: err.message,})
      // });

    } 
    catch (error) {
      //if any mistake in code than show error and catch
      console.error(error.message);
      console.error("Stack Trace:", error.stack);
      res.status(500).send("Internal server error");
    }
  }
);

//Create User using: POST "/api/auth/login". no  login required
router.post(
  "/login",
  [
    //validation add
    body("email", "Enter a valid email").isEmail(),
    body("password", "please enter password").exists(), 
  ],
  async (req, res) => {
     //Vaildation error check
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
       //if error than return message and status
       return res.status(400).json({ errors: errors.array() });
     }

     const  {email, password} = req.body;
    //  console.log(req.body)
    

     try {
      let user = await User.findOne({email})//find user by email
      if(!user){
        return  res.status(400).json({error: "please try to fill correct information"})//user not found then error show
      }
      else{
        console.log("done email")
      }
     

      const comparePassword = await bcrypt.compare(password, user.password) // compare passowrd find in database
      console.log(comparePassword)
      
       // If password doesn't match, return error
      if(!comparePassword){
        return res.status(400).json({error: "please try to fill correct information"})
      }
      else{
        console.log("done password")
      }

      const data = {
        user:{
          id: user.id
        }
      }

      const token  = jwt.sign(data, JWT_SAFFKEY)
      // res.json({token})
      res.status(200).json({ token });
      
     }
      catch (error) {
       //if any mistake in code than show error and catch
       console.error(error.message);
       console.error("Stack Trace:", error.stack);
       res.status(500).send("Internal Server error");
     }
    }
)






module.exports = router;
