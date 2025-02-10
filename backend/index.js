const { io, server, app, express } = require("./socketConnect.js")
const { router: userAuth } = require("./routes/userAuth");
const cors = require('cors');
const { connectToDB } = require("./connectToDB")
const { router: forgetPassword } = require("./routes/forgetPassword")
const { router: home } = require("./routes/userAuth")
const { router: admin } = require("./routes/adminAuth.js")
const { router: cart } = require("./routes/addToCart.js")
const session = require('express-session');
const cookieParser = require("cookie-parser");

require("dotenv").config()


const PORT = process.env.PORT ||  8000

// Use cookie-parser middleware
app.use(cookieParser());



// Middleware to set Cross-Origin-Opener-Policy
app.use((req, res, next) => {
 // res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  next();
})




// Configure express-session middleware
app.use(session({
  secret: `${process.env.SESSION_SECRET_KEY}`, // Replace with a strong secret key
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.COOKIE_SECURE } // Set secure to true if using HTTPS
}));


//CORS
const allowedOrigins = [
  `${process.env.REACT_API_URL}`,
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


app.get("/check-cookie", (req, res) => {
  const cookieName = "accessToken" || "refreshToken"; // Change this to your actual cookie name

  if (req.cookies[cookieName]) {
    res.json({
      exists: true,
      message: `Cookie "${cookieName}" exists!`,
      value: req.cookies[cookieName] // ✅ Return the cookie value
    });
  } else {
    res.json({
      exists: false,
      message: `Cookie "${cookieName}" not found!`
    });
  }
});






// Middleware to parse frontend data (Body)
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded



//MongoDB connection
connectToDB(`${process.env.MONGODB_URL_APP}`)
  .then(() => {
    console.log("MongoDB connected")
  })
  .catch((err) => {
    console.log("some error occured connecting to mongoDB", err)
  })





app.use("/", home)

app.use("/", userAuth)

app.use("/", forgetPassword)

//Admin
app.use("/", admin)

//Cart
app.use("/", cart)



server.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`)
})


