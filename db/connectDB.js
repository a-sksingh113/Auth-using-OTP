import mongoose from 'mongoose';
  export  const connectDB = async ()=>{
    try{
        const connect  = await mongoose.connect(process.env.CONNECTION_STRING);
        console.log("database connected with ", connect.connection.host, connect.connection.name);
    }
    catch (err){
        console.log(err);
        process.exit(1);
    }
}


