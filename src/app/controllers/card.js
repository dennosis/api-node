const express = require("express")
const authMiddleware = require('../middlewares/auth')
const Card = require("../models/card")

const router = express.Router();

router.use(authMiddleware)

router.post('/', async (req, res) =>{
    try{
        if(req.body.type=="")
            return res.status(400).send({error:"O Tipo de Cartão é Obrigatorio"})
        
        if(req.body.number=="")
            return res.status(400).send({error:"O Numero do Cartão é Obrigatorio"})
        
        if(req.body.codVerf=="")
            return res.status(400).send({error:"O Código de Verificação á Obrigatorio"})
        
        if(req.body.dtExp=="")
            return res.status(400).send({error:"A Data de Expiração é Obrigatorio"})
        
        if(req.body.country=="")
            return res.status(400).send({error:"O País é Obrigatório"})

            

        const card = await Card.create({...req.body, user: req.userId});
        return res.send({card})
    }catch(err){
        return res.status(400).send({error:"falha ao cadastrar o cartão"})
    }
});

router.get('/', async (req, res) =>{
    try{
        const cards = await Card.find({user: req.userId});
        return res.send({cards})
    }catch(err){
        return res.status(400).send({error:"falha ao carregar os cartoes"})
    }

});

router.get('/:cardId', async (req, res) =>{
    try{
        const card = await Card.findById(req.params.cardId);
        return res.send({card})
    }catch(err){
        return res.status(400).send({error:"falha ao carregar o cartao"})
    }
});

router.put('/:cardId', async (req, res) =>{
    try{

        if(req.body.type=="")
            return res.status(400).send({error:"O Tipo de Cartão é Obrigatorio"})
        
        if(req.body.number=="")
            return res.status(400).send({error:"O Numero do Cartão é Obrigatorio"})
        
        if(req.body.codVerf=="")
            return res.status(400).send({error:"O Código de Verificação á Obrigatorio"})
        
        if(req.body.dtExp=="")
            return res.status(400).send({error:"A Data de Expiração é Obrigatorio"})
        
        if(req.body.countr=="")
            return res.status(400).send({error:"O País é Obrigatório"})




        const card = await Card.findByIdAndUpdate(req.params.cardId,{...req.body, user:req.userId},{new: true});
        return res.send({card})
    }catch(err){
        return res.status(400).send({error:"falha ao atualizar o registro"})
    }
});

router.delete('/:cardId', async(req, res) =>{
    try{
        const card = await Card.findByIdAndRemove(req.params.cardId);
        return res.send({card})
    }catch(err){
        return res.status(400).send({error:"falha ao carregar o cartao"})
    }
});

module.exports = app => app.use('/cards', router)