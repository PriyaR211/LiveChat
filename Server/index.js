const express = require("express");
const cors = require("cors");
require('dotenv').config(); // Load environment variables
const connectDB = require("./config/connectDB.js");

const router = require("./routes/index.js");
const cookiesParser = require("cookie-parser");

const {app, server} = require("./socket/index.js");

// const app = express();

// Enables CORS for routes
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}))

// parsing post request(Very Imp)
app.use(express.json());

// Parsing cookies
app.use(cookiesParser());


const Port = process.env.Port || 8080;

app.get("/" , (req, res)=>{
    // res.send("server is started");
    res.json({
        message: "Server is started at : " + Port
    })
})


// api endpoints
app.use("/api", router);



// app.listen(Port, ()=>{
//     console.log("App is listening at port : " + Port);
// })

connectDB().then(()=>{
    // app.listen(Port, ()=>{
    //     console.log("App is listening at port : " + Port);
    // })
    server.listen(Port, ()=>{
        console.log("App is listening at port : " + Port);
    })
})






