const express = require('Express');
const router = express.Router();
const tweets = require('../models/tweet')

router.get('/tweets', async(req, res)=>{
    
    try{
        const resultData = await tweets.find(); 
        res.json({
            success: true,
            data: resultData
        })
    }catch(error){
        console.log(error);
        res.json({
            success: false,
        })
    }

})

module.exports = router;

