const UserModel = require("../models/userModel");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function checkPassword(req, res){
    try{
        const{password, userId}=req.body;
        const User = await UserModel.findById(userId);

        const verifyPassword = await bcryptjs.compare(password, User.password);
        if(!verifyPassword){
            return res.status(400).json({
                message:"Please check password",
                error:true
            })
        }

        const tokenData={
            id: User._id,
            email:User.email
        }
        const token = await jwt.sign(tokenData,process.env.JWT_SECRET_KEY,{expiresIn:"1d"});
        
        // Cookies for storing jwt
        const CookieOptions={
            secure:true,
            http:true
        }

        return res.cookie("token",token,CookieOptions).status(200).json({
            message:"Login successfully",
            // data:User,
            token:token,
            success:true
        })

    }
    catch(err){
        return res.status(500).json({
            message:"Something went wrong : " + err.message || err,
            error:true
        })
    }
}


module.exports = checkPassword;

