const express = require("express")
const User = require("../models/User")
const router = express.Router();

//const multer = require('multer')
//const upload = multer({dest:"uploads/"})

const authMiddleware = require('../middlewares/auth')



router.use(authMiddleware)

//upload.single('image')
router.put("/:userId",async (req, res) =>{
/*
    if(req.file)
        console.log(req.file)
*/
        try{
        
            if(req.body.firstName== "")
                res.status(400).send({error:"Nome Obrigatorio"})
            
            if(req.body.lastName== "")
                res.status(400).send({error:"Sobrenome Obrigatorio"})
            
            if(req.body.password== "")
                delete req.body.password
            
            if(req.body.cpf== "")
                delete req.body.cpf
            
            if(req.body.account== "")
                res.status(400).send({error:"Conta Obrigatoria"})
            
            if(req.body.isActive== "")
                delete req.body.isActive
            
            if(req.body.valueAccount== "")
                delete req.body.valueAccoun
            
            if(req.body.img== "")
                delete req.body.img

            const user = await User.findOneAndUpdate({_id:req.params.userId},{...req.body},{new: true});
           
            return res.send(user)
        }catch(err){
            return res.status(400).send({error:"falha ao atualizar o Usuario"})
        }
})

module.exports = app => app.use('/user', router)
