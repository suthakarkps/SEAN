var express = require('express')
var router = express.Router();

router.get('/raja', (req,res,next)=>{
    res.send('rqaja')
})

module.exports = router;
