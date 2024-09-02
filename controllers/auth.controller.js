import {User} from '../models/user.model.js'
import bcryptjs  from 'bcryptjs'
import {generateTokenAndSetCookie} from '../utils/generateTokenAndSetCookie.js'

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
    verificationTokenExpiresAt:Date.now()+24*60*60*1000
    });
      await user.save();
      generateTokenAndSetCookie(res,user._id);
      res.json({succes:true,
        message: "user created successfully!",
        uesr:{
            ...user._doc,
            password:undefined,
        }
      });
    }

    catch (error) {
       res.status(400).json({success:true,message:error.message}); 
    }
    
}

export const login = async (req,res)=>{
    res.send("login routes");
}

export const logout = async (req,res)=>{
    res.send("logout routes");
}