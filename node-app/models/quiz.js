const mongoose = require('mongoose')

const QuizSchema = new mongoose.Schema({
        id: {
            type:Number,
            required:true
        },
        question: 
        {
            type:String,
            required:true
        },
        options: [
            {
            a: {
                type:String
            },
            t:{ 
                type:Boolean
            },
            _id: false
        }]
},
{
    timestamps:true
})
const Quiz = mongoose.model('quizquestion',QuizSchema)

module.exports = Quiz