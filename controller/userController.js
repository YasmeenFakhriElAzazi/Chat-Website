const User = require('../models/userModel') ;
const Contact = require('../models/contactListModel') ;
const {validationResult} = require('express-validator')
const httpStatusText = require("../utils/httpStatusText")


exports.getUsersForSidebar = async (req, res) => {
	try {
		const loggedInUserId = req.user._id;

		const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } } ,{"__v" : false , "password": false , "token" : false});

		res.status(200).json(filteredUsers);
	} catch (error) {
        return res.status(500).json({status : httpStatusText.ERROR , data : null , message :error.message , code : 500 })
	}
};



exports.getUser = async (req,res)=>{

    try {
        const user  = await User.findById(req.params.id)
        if(!user){
            return res.status(404).json({status : httpStatusText.FAIL , data : {user : "user not found "} })
        }
        res.json({status : httpStatusText.SUCCESS , data : {user} })    
    } catch (error) {
        return res.status(400).json({status : httpStatusText.ERROR , data : null , message :error.message , code : 400 })
        
    }
}

exports.addUserToAcoount = async(req, res)=>{
    const loggedInUserId = req.user._id ;
    const contactId = req.params.id ;

    const contactList  = await Contact.findOne({loggedInUserId}) ;
    if(!contactList){
        await Contact.create({loggedInUserId , contacts : [contactId]})
    }else {
        if (!contactList.contacts.includes(contactId)){
            contactList.contacts.push(contactId) ;
            await contactList.save()
        }
    }

}
exports.updateUser = async (req, res)=>{
    const id  = req.params.id
    try {
        const updatedUser = await User.updateOne({_id : id} , {$set : {...req.body}})
        res.status(200).json({status : httpStatusText.SUCCESS , data : {user : updatedUser}}) ;
        
    } catch (error) {
        return res.status(400).json({status : httpStatusText.ERROR , message: error.message})
    }
}

exports.deleteUser = async  (req, res)=>{
    const deletedUser  = await User.deleteOne({_id : req.params.id})
    res.status(200).json({status : httpStatusText.SUCCESS , data :null }) ;
}

