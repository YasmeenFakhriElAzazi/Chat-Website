const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', 
            required: true,
        },
        contacts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User', 
            },
        ],
    },
    {
        timestamps: true, 
    }
);

const Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact;
