const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
const User = require("../models/User")
const authConfig = require("../../config/auth")
const router = express.Router();


function generateToken(params = {}){
    return jwt.sign(params,authConfig.secret, {
        expiresIn:86400
    })

}


router.post('/register', async (req, res) =>{
    const email   = req.body.email
    try{

        if(req.body.email == "")
            return res.status(400).send({error:"Informar email"})

        if(await User.findOne({ email }))
            return res.status(400).send({error:"Email ja Cadastrdo"})

        if(req.body.firstName == "")
            return res.status(400).send({error:"Informar Primeiro Nome"})

        if(req.body.lastName == "")
            return res.status(400).send({error:"Informar Sobrenome"})

        if(req.body.account == "")
            return res.status(400).send({error:"Informar Conta"})
        
        if(req.body.password == "")
            return res.status(400).send({error:"Informar Senha"})


        const user = await User.create(req.body);
        user.password = undefined
        return res.send({
            user, 
            token: generateToken({id: user.id})
        })
    
    }catch(err){
        return res.status(400).send({error:'Falha ao Registar Usuario'})
    }
});


router.post("/authenticate", async (req, res) =>{
    const {email, password}  = req.body

        if(email == "")
            return res.status(400).send({error:"Inserir Email"})

            
        if(password == "")
            return res.status(400).send({error:"Inserir Senha"})
         
        const user  = await User.findOne({email}).select('+password');

        if(!user)
            return res.status(400).send({error:"Usuario Não cadastrado"})
            
        if(!await bcrypt.compare(password, user.password))
            return res.status(400).send({error:"Senha Invalida"})

        user.password = undefined

        res.send({
                user, 
                token: generateToken({id: user.id})
        }) 
})

router.get('/', async (req, res) =>{
    try{
        const users = await User.find();
        return res.send({users})
    }catch(err){
        return res.status(400).send({error:"falha ao carregar os cartoes"})
    }

});

module.exports = app => app.use('/login', router)
