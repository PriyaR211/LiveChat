const mongoose = require("mongoose");

async function connectDB(){
    try{
        
        await mongoose.connect(process.env.MONGODB_URL);

        const connection = mongoose.connection;
        connection.on("connected", ()=>{
            console.log("Database is connected ");
        })
        connection.on("err", ()=>{
            console.log("Some error in mongoDB connection " + err);
        })
    }
    catch(err){
        console.log("Something is wrong in mongoDB connection " + err);
    }
}


module.exports = connectDB;















