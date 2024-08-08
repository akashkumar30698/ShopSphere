const express = require("express")
const app = express()
const {router: userAuth }= require("./routes/userAuth");
const cors = require("cors");
const { connectToDB } = require("./connectToDB")
const { router: home } = require("./routes/userAuth")
require("dotenv").config()


const PORT =  8000





//CORS
let whitelist = ['http://localhost:5173']


let corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors(corsOptions))





// Middleware to parse frontend data (Body)
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

//MongoDB connection
connectToDB("mongodb://localhost:27017/e-commerce")
.then(()=>{
  console.log("MongoDB connected")
})
.catch((err) =>{
  console.log("some error occured connecting to mongoDB",err)
})



app.use("/",home)

app.use("/",userAuth)





app.listen(PORT,()=>{
    console.log(`Server started at http://localhost:${PORT}`)
})