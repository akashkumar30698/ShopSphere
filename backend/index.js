const { io,server,app,express } = require("./socketConnect.js")
const {router: userAuth }= require("./routes/userAuth");
const cors = require('cors');
const { connectToDB } = require("./connectToDB")
const {router : forgetPassword} = require("./routes/forgetPassword")
const { router: home } = require("./routes/userAuth")
const {router : admin } = require("./routes/adminAuth.js")
require("dotenv").config()


const PORT =  8000



 // Middleware to set Cross-Origin-Opener-Policy
   app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
    next();
   })




//CORS
const allowedOrigins = [
  'http://localhost:5173',
   // Add all potential front-end URLs
];


const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
};

app.use(cors(corsOptions));





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

app.use("/",forgetPassword)

//Admin
app.use("/",admin)











server.listen(PORT,()=>{
    console.log(`Server started at http://localhost:${PORT}`)
})


