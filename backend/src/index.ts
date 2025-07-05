
//web framework to create routes ,handle requests and build API server
import express from 'express';
//library helping to interact with mongoDB using models and schemas
import mongoose from 'mongoose';
//allows frontend working on a different port to access backend 
import cors from 'cors';
//for loading environment variables
import dotenv from 'dotenv';

//activates so .env file is read
dotenv.config();

//creating an instance of express application 
const app=express();

//port number the server will run on
const PORT =process.env.PORT || 5000;

//enables cors on all routes (allows requests from other origins)
app.use(cors());
//tells express to automatically parse JSON 
app.use(express.json());

//defines a basic route for GET requests at root URL 
app.get('/',(_req,res)=>{
    res.send('API is running ...');
})

//connect to mongodb
mongoose
.connect(process.env.MONGO_URI!)
.then(()=>{
    console.log('Connected to MongoDB');
    app.listen(PORT,()=>{
        console.log(`Server running on port ${PORT}`);
    })
})
.catch((err)=>{
    console.log(err);
})