const express = require("express")
const connect = require("./configs/db")
let app = require("./index")


app.listen(5000,async()=>{
    try {
        await connect()
        console.log("This is port 5000")
    } catch (error) {
        console.log(error)
    }
})