const mongoose = require('mongoose');

const userVerificationSchema = new mongoose.Schema(
    {
       
        tempUserData: { 
            fullName: { type: String, required: true },
            email: { type: String, required: true },
            password: { type: String, required: true },

        },
        email : {
            type: String,

        },
        verificationCode: {
            type: String,
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
        token : {
            type : String ,
            default : ""
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('UserVerification', userVerificationSchema);
