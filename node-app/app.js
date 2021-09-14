const express = require('express')
const app = express()
app.use(express.json())
const cors = require('cors')
app.use(cors())
const {makeConnection} = require('./utils/mongoose')
makeConnection()
const QuizRouter = require('./routes/quizroute')
const UserRouter = require('./routes/userroute')
const port = process.env.PORT || 3001

app.use(QuizRouter)
app.use(UserRouter)
app.get("*",async(req,res)=>{
    res.status(404).send({error:"Url Not Found"})
})

app.post("*",async(req,res)=>{
    res.status(404).send({error:"Url Not Found"})
})

app.patch("*",async(req,res)=>{
    res.status(404).send({error:"Url Not Found"})
})

app.delete("*",async(req,res)=>{
    res.status(404).send({error:"Url Not Found"})
})

app.listen(port, ()=>{
    try {
    console.log("server is up at port : "+port)   
    } catch (error) {
    console.log("Error while starting the server"+error)
    }

})