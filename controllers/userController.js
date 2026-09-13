const User = require("../models/User");
const bcrypt = require("bcryptjs");
const asyncWrapper = require("../middleware/asyncWrapper");
const AppError = require("../utilities/appError");

// Get all users
const getAllUsers = asyncWrapper(async (req, res, next) => {
  const users = await User.find().select("-password");
  res.status(200).json({
    message: "Users retrived successfully",
    data: {
      users,
    },
  });
});

//Get one user
const getUser = asyncWrapper(async (req, res, next) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) {
    return next(new AppError("user not found", 404));
  }
  res.status(200).json({
    message: "User retrived successfully",
    data: {
      user,
    },
  });
});

//Update User
const updateUser = asyncWrapper(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  // console.log(name);
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError(" User  not found", 404));
  }
  //update name
  if (name) {
    user.name = name;
  }
  //update email
  if (email) {
    user.email = email;
  }
  //update pass
 if (password) {

  if (password.length < 6) {
    return next(
      new AppError("Password must be at least 6 characters", 400)
    );
  }

  user.password = await bcrypt.hash(password, 10);
}
  if (role) {
    user.role = role;
  }

  await user.save();

  res.status(200).json({
    message: "User updated successfully",
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
});

// Delete User
const deleteUser = asyncWrapper(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new AppError("The user not found", 404));
  }

  res.status(200).json({
    message: "User is deleted",
  });
});

module.exports = { getAllUsers, getUser, updateUser, deleteUser };
