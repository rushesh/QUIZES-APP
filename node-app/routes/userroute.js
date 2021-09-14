const express = require('express')
const userRouter = new express.Router()
const User = require('../models/user')

userRouter.get("/userget",(req,res)=>{
    const username = req.params.name
    const email = req.params.email
    User.find({username,email}, function (err, docs) {
        if (err){
            // console.log(err);
            res.status(500).send(err)
        }
        else{
            // console.log("Result ", docs);
            res.status(200).send(docs)
        }
    });
})

userRouter.post("/user",(req,res)=>{
    const user = new User(req.body)
    user.save().then((result)=>{
        res.status(201).send(result)
    }).catch((err)=>{
        res.status(400).send(err)
    })
})


module.exports = userRouter