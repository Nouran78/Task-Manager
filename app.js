const express= require ("express");
const dotenv=require ("dotenv");
const connectDB= require("./config/db");
dotenv.config();
const app= express();
const cors=require("cors");
const authRoutes=require("./routes/authRoutes");
app.use(express.json());
app.use(cors());
connectDB();

app.get("/",(req,res)=> {
    res.json ({
message:"Api is working"

    });

});
app.use("/api/user",authRoutes) 
const PORT=process.env.PORT || 5000;
app.listen (PORT, ()=> {
    console.log (`Server is running on this ${PORT}`);
}) ;