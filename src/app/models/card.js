const mongoose = require('../../database')

const CardSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
        select:false,
    },
    number:{
        type: Number,
        required:true,
    },
    type:{
        type: Number,
        required:true,
    },
    codVerf:{
        type: Number,
        required:true,
    },
    dtExp:{
        type: String,
        required:true,
    },
    country:{
        type: Number,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now,
        select:false,
    },
})

const Card = mongoose.model('Card', CardSchema)

module.exports = Card