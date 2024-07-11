import mongoose from "mongoose";
import {connectionString} from '../envVariables/envvariables'
function connectDb(){
    mongoose.connect(connectionString)
.then(() => console.log('Connected to MongoDB database'))
.catch(err => console.error('Error connecting to MongoDB database:', err));
    
}

export default connectDb
