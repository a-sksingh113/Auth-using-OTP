import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true 
    },
    lastlogin:{
        type: Date,
        default: Date.now
    },
    isVerfied:{
        type: Boolean,
        default: false
    },
    resetPasswordToken:String,
    resetPasswordExpiresat:Date,
    verificationToken:String,
    verificationTokenExpiresat:Date,    
},
    {
        timestamps:true
    
    }
);
export const User = mongoose.model('User', userSchema);
