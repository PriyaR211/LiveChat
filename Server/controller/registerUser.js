
const UserModel = require("../models/userModel");
const bcryptjs = require("bcryptjs");

async function registerUser(req, res){
    try{
        const{name, email, password, profile_pic} = req.body;
        console.log("req body is : " + Object.values(req.body));
        
        const emailFind = await UserModel.findOne({email});

        if(emailFind){
            return res.status(400).json({
                message:"user is already registered",
                error:true
            })
        }
        // Password into HashPassword
        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(password, salt);

        const payload = {
            email,
            profile_pic,
            password:hashPassword,
            name
        }
        const user = new UserModel(payload);
        const userSave = await user.save();

        return res.status(400).json({
            message:"user created successfully",
            data:userSave,
            success:true
        })

    }
    catch(error){
        return res.status(500).json({
            message: error.message || message,
            error:true
        })
    }
}


module.exports=registerUser;





