const express= require('express')

const app =express()

let port = 4000

app.get('/',(req,res)=>{
    res.send("Hello world")
})






app.listen(port,()=>{
    console.log('listening at port '+port)
})