import {User} from '../models/user.model.js'
import crypto from 'crypto'
import bcryptjs  from 'bcryptjs'
import {generateTokenAndSetCookie} from '../utils/generateTokenAndSetCookie.js'
import {sendVerificationEmail , sendWelcomeEmail} from '../mailtrap/emails.js'


export const signup = async (req,res)=>{
const {name, email, password} = req.body;
    try{
       if(!email ||  !password || !name){ 
       throw new Error("All fields are required!");
    }
    const userAlreadyExists = await User.findOne({email});
    if(userAlreadyExists){
    return  res.status(400).json({succes:false,message: "user already exists!"});
    }
    const hashedPassword = await bcryptjs.hash(password, 10);
    const verificationToken = Math.floor(100000+Math.random()*900000).toString();
    const user = new User({
    name,
    email,
    password: hashedPassword,
    verificationToken,
    verificationTokenExpiresat:Date.now()+24*60*60*1000

    });
      await user.save();
      generateTokenAndSetCookie(res,user._id);
      await sendVerificationEmail(user.email,verificationToken);
      res.json({succes:true,
        message: "user created successfully!",
        user:{
            ...user._doc,
            password:undefined,
        }
      });
    }

    catch (error) {
       res.status(400).json({success:true,message:error.message}); 
    }
    
}
export const verifyEmail = async (req,res)=>{
  //1 2 3 4 5 6 after getting code from user
  const {code} = req.body;
  console.log(code);
  try { 
    const user =  await User.findOne({

      verificationToken : code,
      verificationTokenExpiresat:{$gt:Date.now()},
      
    });
    
    if(!user){
   
      return res.status(400).json({ success:false ,message:"invalid or expire verification code"});
    }

    user.isVerfied=true ;
    user.verificationToken=undefined;
    user.verificationTokenExpiresat=undefined;
    await user.save();
    await sendWelcomeEmail(user.email,user.name);
    res.json({success:true,message:"email verified successfully",user:{
      ...user._doc,
      password:undefined,
    },
  }); 
  }
   catch (error) {
  console.log("error in verifing email",error);
  res.status(500).json({success:false,message:"server error"});
    
  }
};


export const login = async (req,res)=>{
const {email,password} = req.body;
try {
  const user = await User.findOne({email});
  if(!user){
    return res.status(400).json({success:false,message:"invalid email or password"});
  }
  const isPasswordValid = await bcryptjs.compare(password,user.password);
  if(!isPasswordValid){
    return res.status(400).json({success:false,message:"invalid email or password"});
  }
  generateTokenAndSetCookie(res,user._id);
  user.lastlogin  = Date.now();
  await user.save();
  res.json({success:true,message:"logged in successfully",
  user:{
    ...user._doc,
    password:undefined,},}
);
  
}
 catch (error) 
{
 console.log("error in login ",error);
  res.status(500).json({success:false,message:"server error"}); 
}

   
}

export const logout = async (req,res)=>{
res.clearCookie("token");
res.json({success:true,message:"logged out successfully"});
}