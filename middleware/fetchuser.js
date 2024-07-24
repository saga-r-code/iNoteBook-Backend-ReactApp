const jwt = require("jsonwebtoken"); //this pakage for generate token

const JWT_SAFFKEY = 'Sagee$plash' 


const fetchuser = (req, res, next) =>{ //this is middleware
    //get token through req.header and para "auth-token"
     const token = req.header("auth-token")
     if(!token){
        return res.status(401).send({error: "Please authenticate using a valid token" }) //if token not found
        }

    try {
        const data = jwt.verify(token, JWT_SAFFKEY ) //token and key verify than send data
        req.user = data.user //show data
        next() //basically next() run next middleware in my case async function is next after middleware 
        
    } catch (error) {
     res.status(401).send({error: "Please authenticate using a valid token" })
    }
}

module.exports = fetchuser