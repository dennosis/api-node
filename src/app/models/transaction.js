const mongoose = require('../../database')


const TransactionSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    userDest:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    operation:{
        type:Number,
        required:true,
        default:1,
    },
    value:{
        type:Number,
        required:false,
        default:0,
    },
    valueCard:{
        type:Number,
        default:0,
        required:false
    },
    card:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Card',
        required:false
    },
    isConfirmed:{
        type:Boolean,
        default:true,
    },
    createdAt:{
        type:Date,
        default:Date.now,
        select:true,
    },
})

const Transaction = mongoose.model('Transaction', TransactionSchema)

module.exports = Transaction