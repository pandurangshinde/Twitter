const express = require('Express');
const router = express.Router();
const users = require('../models/users')

router.get('/users', (req, res)=>{
    
    try{
        // const resultData = await users.find(); 
        res.json({
            success: true,
            data: "resultData"
        })
    }catch(error){
        console.log(error);
        res.json({
            success: false,
        })
    }

})

router.post('/users', async(req, res)=>{
    const user = new users({
        DisplayName: req.body.DisplayName,
        UserName:req.body.UserName,
        Bio: req.body.Bio
    })

    try{
        const newUser = await user.save();
        res.json(newUser);
    }catch(error){
        console.log(error);
    }

})


module.exports = router;