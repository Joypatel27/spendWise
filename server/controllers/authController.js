const User=require('../models/User');
const bycrypt= require('bycrypt');
const jwt =require('jsowebtoken');

exports.signup= async (req,res) => {
    const {email,name, password,contactNumber}=req.body;
    try{
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"user already exist"});
        }
        const hashedPassword =await bycrypt.has(password,10);
        const newUser=await User.create({name,email,password:hashedPassword});

        const token=jwt.sign({id: newUser._id})
    }catch(error){

    }
    
}
