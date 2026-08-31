const User = require("./../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//register user

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        //validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please fill all fields" });
        }
        //check if user already exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.json({ message: "This user already exists" });
        }

        //Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        //create user
        const user = await User.create({ name, email, password: hashedPassword });
        res.status(201).json({
            message: "User registered successfully", user: {
                id: user._id,
                name: user.name,
                email: user.email,
            }
        });

    } catch (error) {
        res.status(500).json({
            message: error.message

        });
    }
};

module.exports = { registerUser };