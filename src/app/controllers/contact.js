const express = require("express")
const authMiddleware = require('../middlewares/auth')
const Contact = require("../models/contact")
const router = express.Router();
//const User = require("../models/user")
const User = require("../models/User")

router.use(authMiddleware)

router.post('/', async (req, res) =>{
    try{
        const tmpcontact = await Contact.create({...req.body, user: req.userId});
        const contact = await Contact.findById(tmpcontact._id).populate("contact")
            
        
        return res.send( {
            _id:contact._id,
            idUserContact:contact.contact._id,
            firstName:contact.contact.firstName,
            lastName:contact.contact.lastName,
            cpf:contact.contact.cpf,
            account:contact.contact.account,
            isContact: true,
        })
        
        
        
        
        
        //return res.send(contact)
    }catch(err){
        return res.status(400).send({error:"falha ao adicionar contato"})
    }
});




router.post('/find', async (req, res) =>{
   //console.log(res)
   /*
    id:element.id, 
    idContact:idContact, 
    firstName:element.firstName,
    lastName:element.lastName,
    cpf:element.cpf,
    account:element.account,
    img:element.img,
    isContact: isContact
   */
   
   /*
                       
                    
*/
   
    try{
        let tmpusers
        let contacts
        if(req.body.name > ""){


            let first = req.body.name.split(' ')[0]
            let last = req.body.name.split(' ')
            last.shift()
            last = last.join(' ')

            //firstName:{ $regex: '.*' + first + '.*' }, 
            //lastName:{ $regex: '.*' + last + '.*' }
            tmpusers = await User.find({
                    firstName:{$regex: new RegExp(first, "i")}, 
                    lastName:{$regex: new RegExp(last, "i")}
            });


            contacts = await Promise.all(tmpusers.map( async tmpuser => {
                const qcontact = await Contact.find({user: req.userId, contact: tmpuser._id})
    
                    var qIsContact
                    var qidcontact
                    
                    if(qcontact[0] != null){
                        qIsContact = true
                        qidcontact = qcontact[0]._id
                    }else{
                        qIsContact = false
                        qidcontact = ""
                    }
                
                return {
                        _id:qidcontact,
                        idUserContact:tmpuser._id,
                        firstName:tmpuser.firstName,
                        lastName:tmpuser.lastName,
                        cpf:tmpuser.cpf,
                        account:tmpuser.account,
                        isContact: qIsContact,
                    }
                
            }))


        }else if(req.body.account > ""){
             
            tmpusers = await User.find({account:{ $regex: '.*' + req.body.account + '.*' }});

            contacts = await Promise.all(tmpusers.map( async tmpuser => {
               const qcontact = await Contact.find({user: req.userId, contact: tmpuser._id})
  
                var qIsContact
                var qidcontact
                
                if(qcontact[0] != null){
                    qIsContact = true
                    qidcontact = qcontact[0]._id
                }else{
                    qIsContact = false
                    qidcontact = ""
                }
            
               return {
                    _id:qidcontact,
                    idUserContact:tmpuser._id,
                    firstName:tmpuser.firstName,
                    lastName:tmpuser.lastName,
                    cpf:tmpuser.cpf,
                    account:tmpuser.account,
                    isContact: qIsContact,
                }
            
            }))

        }else if(req.body.cpf > ""){
            
           // 
           //new RegExp(req.body.cpf, 'i')
            tmpusers = await User.find({cpf:{ $regex: '.*' + req.body.cpf + '.*' }});

            contacts = await Promise.all(tmpusers.map( async tmpuser => {
               const qcontact = await Contact.find({user: req.userId, contact: tmpuser._id})
  
                var qIsContact
                var qidcontact
                
                if(qcontact[0] != null){
                    qIsContact = true
                    qidcontact = qcontact[0]._id
                }else{
                    qIsContact = false
                    qidcontact = ""
                }
            
               return {
                    _id:qidcontact,
                    idUserContact:tmpuser._id,
                    firstName:tmpuser.firstName,
                    lastName:tmpuser.lastName,
                    cpf:tmpuser.cpf,
                    account:tmpuser.account,
                    isContact: qIsContact,
                }
            
            }))


        }else{

            const tmpcontacts = await Contact.find({user: req.userId}).populate("contact");
            
            contacts = tmpcontacts.map(tmpcontact => {
                
                return {
                    _id:tmpcontact._id,
                    idUserContact:tmpcontact.contact._id,
                    firstName:tmpcontact.contact.firstName,
                    lastName:tmpcontact.contact.lastName,
                    cpf:tmpcontact.contact.cpf,
                    account:tmpcontact.contact.account,
                    isContact: true,
                }
            })

            
        }

        return res.send({contacts})

    }catch(err){
        return res.status(400).send({error:"falha ao carregar os cartoes"})
    }





});

router.delete('/:contactId', async(req, res) =>{
    try{
        const contact = await Contact.findByIdAndRemove(req.params.contactId);
        return res.send({contact})
        /*
        return res.send( {
            _id:contact._id,
            idUserContact:contact.contact._id,
            firstName:contact.contact.firstName,
            lastName:contact.contact.lastName,
            cpf:contact.contact.cpf,
            account:contact.contact.account,
            isContact: true,
        })
        */


    }catch(err){
        return res.status(400).send({error:"falha ao deletar o registro"})
    }
});

module.exports = app => app.use('/contacts', router)