const express = require('express')
const quizRouter = new express.Router()

const Quiz = require('../models/quiz')

quizRouter.get("/quizquestions",(req,res)=>{
    Quiz.find({}, function (err, docs) {
        if (err){
            // console.log(err);
            res.status(500).send(err)
        }
        else{
            // console.log("First function call : ", docs);
            res.status(200).send(docs)
        }
    });
})

quizRouter.post("/quizquestionscreate",(req,res)=>{
    const q = new Quiz(req.body)
        q.save().then((result)=>{
            res.status(201).send(result)
        }).catch((err)=>{
            res.status(400).send(err)
        })
})


module.exports = quizRouter