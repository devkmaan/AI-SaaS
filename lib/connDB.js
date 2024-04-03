// const mongoose = require('mongoose');

// save this in .env.local
// MONGODB_URL = "mongodb+srv://admin:admin@cluster0.eyjwuoa.mongodb.net/userdatapractice?retryWrites=true&w=majority"
// apne databse ka naam yaha likha karo taaki directly naming ho paye----^^^^^^^^^^^^^^^^
// , agar nahi hai toh create bhi kardega


// export const connectDB = async() =>{

//   try {
//     const {connection} = await mongoose.connect(process.env.MONGODB_URL,{
//       dbName: "userdatapractice",
//     });
//     console.log("DB is connected");

//     // testing and creating a new User
//     // const userdata = await new User({
//     //   name:"utkarsh",
//     //   email:"abc@gmail.com",
//     //   password:"test",
//     //   about:"testing user"
//     // });
//     // await userdata.save();
//     // console.log("user created");

//   } catch (error) {
//     console.log("connection to DB failed");
//     console.log(error);
//   }
// }
// ORIGINAL CODE WHICH IS NOT OPTIMISED

// NEW OPTIMISED CODE
import mongoose from 'mongoose';
const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) {
    throw new Error(
        "Please define the MONGODB_URI environment variable inside .env.local"
    )
}


let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = {con: null, promise: null}
}

export const connectDB = async () => {
    if (cached.conn) {
        return cached.conn;
    }


// If a connection does not exist, we check if a promise is already in progress. If a promise is already in progress, we wait for it to resolve to get the connection
    if (!cached.promise) {
        const opts = {
            bufferCommands : true,
        };

        cached.promise = await mongoose.connect(MONGODB_URL, opts).then((mongoose) => {
            console.log("DB Connected");
            return mongoose
        })
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

