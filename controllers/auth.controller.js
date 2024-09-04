import {User} from '../models/user.model.js'
import crypto from 'crypto'
import bcryptjs  from 'bcryptjs'
import {generateTokenAndSetCookie} from '../utils/generateTokenAndSetCookie.js'
import {sendVerificationEmail , sendWelcomeEmail,sendPasswordResetEmail,sendResetSuccessEmail} from '../mailtrap/emails.js'


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
export const forgetpassword = async (req,res)=>{
  const {email} = req.body;
  try {
    const user = await User.findOne({email});
    if(!user){
      return res.status(400).json({success:false,message:"invalid email"});
    }
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiresAt = Date.now()+1*60*60*1000;

    const resetPasswordToken = resetToken;
    const resetPasswordExpiresAt = resetTokenExpiresAt;
    await user.save();

await sendPasswordResetEmail(user.email,`${process.env.CLIENT_URL}/resetpassword/${resetToken}`); 
res.status(200).json({succes:true,message:"password reste link send to your email"});
  } catch (error) {
    console.log("error in forget password",error);
    res.status(500).json({success:false,message:"server error"});

  }
}
export const resetpassword = async (req, res) => {
	try {
		const { token } = req.params;
		const { password } = req.body;

		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
		}

		// update password
		const hashedPassword = await bcryptjs.hash(password, 10);

		user.password = hashedPassword;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpiresAt = undefined;
		await user.save();

		await sendResetSuccessEmail(user.email);

		res.status(200).json({ success: true, message: "Password reset successful" });
	} catch (error) {
		console.log("Error in resetPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};



export const logout = async (req,res)=>{
res.clearCookie("token");
res.json({success:true,message:"logged out successfully"});
}