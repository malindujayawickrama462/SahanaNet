import User from "../models/User.js";
import bcrypt from "bcrypt";

export async function RegisterUser(req,res) {
    try {
        const{name,email,password,role}=req.body;
        if(!name||!email||!password){
            return res.status(400).json({
                msg:"required al fields"
            });
        }
        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({
                msg:"user already exists"
            });
        }
        const salt = await bcrypt.genSalt(10);
        const hasashedPassword = await bcrypt.hash(password,salt);
        const user = await User.create({
            name,
            email,
            password:hasashedPassword,
            role : role 
        })
        if(user){
            res.status(201).json({
                userID:user.userID,
                name:user.name,
                email:user.email,
                role:user.role
            });
        }else{
            res.status(400).json({
                msg:"Invalid data"
            });
        }
    } catch (err) {
        res.status(500).json({
            msg:err.message
        });
    }
};

export async function loginUser(req,res) {
    try {
        const{email,password}=req.body;
        if(!email||!password){
            return res.status(400).json({
                msg:"required all fields"
            });
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                msg:"Invalid email or password"
            });
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({
                msg:"Invalid email or password"
            });
        }
        
    } catch (err) {
        
    }
}