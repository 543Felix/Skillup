import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
    otp: { type: Number, required: true },
    name: { type: String, required: true },
    
},{timestamps: true});

otpSchema.index({createdAt: 1},{expireAfterSeconds: 60})
const Otp = mongoose.model('Otp', otpSchema);

export default Otp;
