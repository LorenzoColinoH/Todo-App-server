const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const Todo = require("./Todo.js")

const app = express() 
app.use(express.json())
app.use(cors())

mongoose.set('strictQuery', false);
//mongoose.connect("mongodb://0.0.0.0:27017/base")
mongoose.connect("mongodb+srv://lorenzocolinoh:hola123@clustertodo.le6wbvt.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })


app.get("/all", autenticado ,async (req,res)=> {
    const todos = await Todo.find()
    res.json(todos)
})

app.get("/todos/:userId", autenticado ,async (req,res)=> {
    const {userId} = req.params
    const todos = await Todo.find({userId})
    res.json(todos)
})

app.post("/newTodo", async (req,res)=> {
    const {title, userId} = req.body
    const newTodo = new Todo({title: title, userId: userId})
    try{
        await newTodo.save()
        res.status(200).send("Creado")
        return 
    }
    catch(e){
        console.log(e)
        res.status(400).send("Vuelve a intentarlo")
        return
    }
})
app.delete("/delete/:userId/:title", async (req,res)=> {
    const {title, userId } = req.params
    await Todo.findOneAndRemove({title, userId})
    res.send("Todo eliminado")
})

// MiddleWare 

async function autenticado (req,res,next){
    req.userId = req.body.userId
    next()
}

app.listen(3000)