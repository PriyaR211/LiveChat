const getUserDetailsFromToken = require("../helper/getUserDetailsFromToken");

async function userDetailss(req, res){
    try{
        const token = req.cookies.token || "";

        const user = await getUserDetailsFromToken(token);
        return res.status(200).json({
            message:"User details",
            data:user
        })
    }
    catch(err){
        return res.status(500).json({
            message:err.message||message,
            error:true
        })
    }
}


module.exports = userDetailss;





