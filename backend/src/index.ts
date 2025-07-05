import express from 'express';//web framework to create routes ,handle requests and build API server
import mongoose from 'mongoose';//library helping to interact with mongoDB using models and schemas
import cors from 'cors'; //allows frontend working on a different port to access backend 
import dotenv from 'dotenv';//for loading environment variables
import taskRoutes from './routes/taskRoutes';


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

//to use tasks related routes
app.use('/api/tasks',taskRoutes)

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
    console.error('Error connecting to MongoDB',err)
})