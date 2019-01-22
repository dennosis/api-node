const mongoose = require('../../database');
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({

    firstName:{
        type: String,
        required:true,
    },
    lastName:{
        type: String,
        required:true,
    },
    email:{
        type: String,
        required:true,
        unique:true,
        lowercase:true,
    },
    password:{
        type: String,
        required:true,
        select:false,
    },
    cpf:{
        type: Number,
        required:false,
    },
    account:{
        type: String,
        required:true,
    },
    valueAccount:{
        type: Number,
        required:false,
        default:0,
    },

    isActive:{
        type: Boolean,
        default:true,
        select:false,
    },

    img:{ 
        type: String,
        data: Buffer,
    },
    createdAt:{
        type:Date,
        default:Date.now,
        select:false,
    },

});


UserSchema.pre('save', async function(next){

    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;

    next();
});

UserSchema.pre('findOneAndUpdate', async function(next){
    if(this._update.password != undefined){
        const hash = await bcrypt.hash(this._update.password, 10);
        this._update.password = hash;
    }
    next();
});



const User = mongoose.model('User', UserSchema)

module.exports = User