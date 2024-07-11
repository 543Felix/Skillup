import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
    otp: { type: Number, required: true },
    name: { type: String, required: true },
    expireAt: { type: Date, default: Date.now, expires: 60*1000 } 
});

const Otp = mongoose.model('Otp', otpSchema);

export default Otp;
