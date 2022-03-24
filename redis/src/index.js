let express = require("express")

let  app = express()

module.exports = app
let products = require("./controllers/product_contoller")
app.use(express.json())


app.use("/products",products)