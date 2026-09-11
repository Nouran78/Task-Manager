const User = require("../models/User");
const bcrypt = require("bcryptjs");
const asyncWrapper = require("../middleware/asyncWrapper");
const AppError = require("../utilities/appError");
const generateJWT = require("../utilities/generateJWT");


const register = asyncWrapper(async (req, res, next) => {
const { name, email, password } = req.body;
  //validation
  if (!name || !email || !password) {
    return next(new AppError("Please fill all the fields", 400));
  }
  //check if user already exists
  const userExist = await User.findOne({ email });
  if (userExist) {
    return next(new AppError("User already exists", 400));
  }

  //hash password
  const hashPassword = await bcrypt.hash(password, 10);

  //create user in db
  const user = await User.create({ name, email, password: hashPassword });
  const token = generateJWT({
    id: user._id,
    role: user.role
});

  res.status(201).json({
    message: "The user is created successfully",
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    },
  });
});

//login 
const login=asyncWrapper(async(req,res,next)=>{
const {email,password}=req.body;

if(!email || !password ){
    return next(
        new AppError("Email and password are required", 400)
    );
}

const user=await User.findOne({email});
if(!user){
    return next(
        new AppError ("Invalid Email or Password",401)
    );
}

//password match
const passwordMatch=await bcrypt.compare(
    password,
    user.password
);
if(!passwordMatch){
    return next(
        new AppError("Wrong password",401)
);
}

const token = generateJWT({
    id: user._id,
    role: user.role
});
res.status(200).json({
    message: "Login successful",
    data:{
        token
    }
});
});
module.exports = {
     register,
    login,
    };
