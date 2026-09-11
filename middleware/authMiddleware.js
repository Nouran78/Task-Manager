const jwt=require("jsonwebtoken");
const AppError=require("../utilities/appError");

const verifyToken=(req,res,next)=>{
    const authHeader=req.headers.authorization;
    if(!authHeader){
        return next(
            new AppError("Token is required",401)
        );
    };
    const token=authHeader.split("")[1];
    try{
        const decoded=jwt.verify(
            token,
            process.env.JWT_SECRET
        );
        req.user=decoded;
        next();
    } catch(error){
        return next(
            new AppError("Invalid or expired token",401)
        );
    }
    
};

module.exports=verifyToken;