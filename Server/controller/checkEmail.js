const UserModel = require("../models/userModel");

async function checkEmail(req, res){
    try{
        const{email}=req.body;
        const checkEmail = await UserModel.findOne({email}).select("-password");
        if(!checkEmail){
            return res.status(400).json({
                message:"user not exist",
                error:true
            })
        }

        return res.status(200).json({
            message:"email verified",
            success:true,
            data:checkEmail
        })

    }
    catch(err){
        return res.status(500).json({
            message:err.message || err,
            error:true
        })
    }
}



module.exports = checkEmail;








