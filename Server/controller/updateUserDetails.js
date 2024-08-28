const getUserDetailsFromToken = require("../helper/getUserDetailsFromToken");
const UserModel = require("../models/userModel");

async function updateUserDetails(req, res){
        try{
            const token = req.cookies.token || "";
            const user = await getUserDetailsFromToken(token);
            const {name, profile_pic} = req.body;
            console.log("details:");
            console.log({name,profile_pic});
            console.log(name,profile_pic);
            console.log(req.body);
            
            const updateUser = await UserModel.updateOne({_id:user._id},{
                name,
                profile_pic
            })
           
            const userInfo = await UserModel.findById(user._id);
            return res.status(200).json({
                message:"Updated successfully",
                data:userInfo,
                success:true
            })
        }
        catch(err){
            return res.status(500).json({
                message:err.message||err,
                error:true
            })
        }
}


module.exports = updateUserDetails;


