const mongoose = require('../../database')

const ContactSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
        select:false,
    },
    contact:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now,
        select:false,
    },
})

const Contact = mongoose.model('Contact', ContactSchema)

module.exports = Contact