const express = require('express')
const router = express.Router()

router.get('/' , (req, res)=>{
    obj = {
        a : "sagar",
        number : 15,
    }
    res.json(obj)
})

module.exports = router