import express from 'express'

const PORT = 5000;
const app = express();

app.get("/", (req, res)=> {
    res.json({message: "Server Running", "Avaialable Routes": "/hello"})
})

app.get("/hello", (req, res)=> {
    res.json({message: "Hello World"})
})

const server = app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`)
})