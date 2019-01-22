const express = require("express")
const authMiddleware = require('../middlewares/auth')
const router = express.Router();
const Transaction = require("../models/Transaction")
const User = require("../models/User")
router.use(authMiddleware)
const bcrypt = require("bcryptjs")

router.post('/', async (req, res) =>{
    
    const user = await User.findById(req.userId).select("valueAccount password")   
    /*
    operation:
        1 - tranferencia somente nomal
        2 - transferencia parcial normal, parcial cartao
        3 - transferencia somente cartao
    */

    //validação
    if(req.body.userDest == '')
        return res.status(400).send({error:"Usuario Destino é Obrigatorio"})

    if(req.userId == req.body.userDest)
        return res.status(400).send({error:"Você nao pode tranferir para si mesmo"})

    const userDest = await User.findById(req.body.userDest).select("valueAccount")
    
    if(userDest == null)
        res.status(400).send({error:"Usuario destino Invalido"})

    if(req.body.operation == 0){
        return res.status(400).send({error:"Valor ou Cartão é Obrigatorio"})
    
    }else if(req.body.operation == 1){
        
        if(req.body.value =='' || req.body.value == 0)
            res.status(400).send({error:"Informar o Valor para Transferencia"})

        if(user.valueAccount < req.body.value)
            return  res.status(400).send({error:"O valor Informado é Superior ao Saldo Atual da Conta"})

        //delete req.body.valueCard
        //delete req.body.card
        req.body.valueCard = 0
        delete req.body.card

    }else if(req.body.operation == 2){
        
        if(req.body.value =='' || req.body.value == 0)
            res.status(400).send({error:"Informar o Valor para Transferencia"})

        if(req.body.card == '')
            res.status(400).send({error:"Informar o Cartão"})

        if(req.body.valueCard == '' || req.body.valueCard == 0)
            res.status(400).send({error:"Informar o Valor que Será Realizado Através do Cartão"})
        
        if(user.valueAccount < req.body.value)
            return  res.status(400).send({error:"O valor Informado é Superior ao Saldo Atual da Conta, Tranferir Quantia Excedente para o Cartão"})
        
    }else if(req.body.operation == 3){

        if(req.body.card == '')
            res.status(400).send({error:"Informar o Cartão"})

        if(req.body.valueCard == '' || req.body.valueCard == 0)
            res.status(400).send({error:"Informar o Valor que Será Realizado Através do Cartão"})
    
        req.body.value = 0
    }

    const sumValue = parseFloat(req.body.value) + parseFloat(req.body.valueCard)
    
    if(sumValue > 1000){
        
        if(req.body.password == "" || req.body.password == undefined)
            return res.status(400).send({error:"O valor é superior a R$ 1000,00 Deve-se Informar a Senha"})

        if(!await bcrypt.compare(req.body.password, user.password))
            return res.status(400).send({error:"Senha Invalida"})

        delete req.body.password
    }

        
    try{
        
        
        //tranferencia
        const transactionBefore = await Transaction.find({
            user:  req.userId,
            userDest: userDest._id,
            createdAt:{$gte: new Date(new Date().setMinutes(new Date().getMinutes()-2))}
        })
        

        const tmptransaction = await Transaction.create({...req.body, user: req.userId});


        let transBefore = null
        let transBeforeValue = 0
        let transBeforeValueCard = 0
        if(transactionBefore[0] != null){
            transBefore = transactionBefore[0]._id
            transBeforeValue = transactionBefore[0].value
            transBeforeValueCard = transactionBefore[0].valueCard
            await Transaction.findByIdAndRemove(transBefore)
        }
        

        const valueUser = user.valueAccount - (tmptransaction.value - transBeforeValue)

        
        await User.findOneAndUpdate({_id:user._id},{valueAccount: valueUser},{new: true});
        
        const valueUserDest = userDest.valueAccount + ((tmptransaction.value + tmptransaction.valueCard)-(transBeforeValue + transBeforeValueCard))
        await User.findOneAndUpdate({_id:userDest._id},{valueAccount: valueUserDest},{new: true});

        
        const tmptransactions3 = await Transaction.findById(tmptransaction._id)
        .populate('userDest', '_id firstName account img')
        .populate('card')
    
        let cardNumber = null
        if(tmptransactions3.card != undefined || tmptransactions3.card != null)
            cardNumber = tmptransactions3.card.number
        
        const transaction = {
            _id: tmptransactions3._id,
            user:tmptransactions3.userDest._id,
            nameUser:tmptransactions3.userDest.firstName,
            account: tmptransactions3.userDest.account,
            img: tmptransactions3.userDest.img,
            typetransation:1,
            value: tmptransactions3.value,
            numbercard: cardNumber,
            valueCard: tmptransactions3.valueCard,
            date: tmptransactions3.createdAt,
            isConfirmed: tmptransactions3.isConfirmed,
            transBefore
        }
        
    
        return res.send({transaction, valueAccount: valueUser})


    }catch(err){
        return res.status(400).send({error:"falha ao tranferir"})
    }
});

router.get('/', async (req, res) =>{
    try{

        const tmptransactions = await Transaction.find({
            $or: [ 
                {user:  req.userId}, 
                {userDest: req.userId}, 
            ]
        }).sort({createdAt: -1})
        .populate('userDest', '_id firstName account img', {_id: {$ne:req.userId} })
        .populate('user','_id firstName account img', {_id: {$ne:req.userId}})
        .populate('card')


        transactions = tmptransactions.map(tmptransaction => {
                let user
                let nameUser
                let account 
                let img
                let typetransation
                let valueCard
                let numbercard
                
                if(tmptransaction.user == null){
                    user = tmptransaction.userDest._id
                    nameUser =  tmptransaction.userDest.firstName
                    account =  tmptransaction.userDest.account
                    img =  tmptransaction.userDest.img
                    typetransation = 1

                    if(tmptransaction.card != null){
                        valueCard = tmptransaction.valueCard
                        numbercard = tmptransaction.card.number
                    }else{
                        valueCard = 0
                        numbercard = null
                    }
                }else{
                    user = tmptransaction.user._id
                    nameUser =  tmptransaction.user.firstName
                    account =  tmptransaction.user.account
                    img =  tmptransaction.user.img
                    typetransation = 2
                    valueCard = tmptransaction.user.valueCard
                    numbercard = null
                }
            
                return {
                    _id: tmptransaction._id,
                    user,
                    nameUser,
                    account,
                    img,
                    typetransation,
                    value: tmptransaction.value,
                    numbercard,
                    valueCard,
                    date: tmptransaction.createdAt,
                    isConfirmed: tmptransaction.isConfirmed
                   
                }
            
        })



        return res.send({transactions})
    }catch(err){
        return res.status(400).send({error:"falha ao carregar as transações"})
    }
});

router.delete('/:transactionId', async(req, res) =>{
    try{

        const tmptransaction = await Transaction.findById(req.params.transactionId);

        let tmppdate = (new Date().getTime() - tmptransaction.createdAt.getTime())/60000
        
        if(tmppdate >= 5)
            return res.status(400).send({error:"a transação ja foi confirmada"})

        const transaction = await Transaction.findByIdAndRemove(req.params.transactionId);
        return res.send({transaction})

    }catch(err){
        return res.status(400).send({error:"falha ao deletar o registro"})
    }
});

module.exports = app => app.use('/transactions', router)