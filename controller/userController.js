const User = require('../models/userModel') ;
const Contact = require('../models/contactListModel') ;
const {validationResult} = require('express-validator')
const httpStatusText = require("../utils/httpStatusText")


exports.getUsersForSidebar = async (req, res) => {
	try {
		const loggedInUserId = req.user._id;

		const contactList = await Contact.findOne({userId : loggedInUserId},{"__v" : false , "password": false , "token" : false});

        if (!contactList) {
            return res.status(404).json({ message: "No contacts found for this user." });
        }
        const contactLength  = contactList.contacts.length ;
        
        const   contacts  =[] ;
        for(let  i  =  0  ; i < contactLength ; i++){
             const contact  = await User.findById(contactList.contacts[i])
             if (contact) {
                contacts.push(contact); 
            }
        }
                
        res.status(200).json({ status: "success", data: contacts });	
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

exports.searchUsersByName = async (req, res) => {
    try {
      const { name } = req.query;
      const loggedInUserId = req.user._id;
  
     
      const users = await User.find(
        { 
          _id: { $ne: loggedInUserId }, 
          fullName: { $regex: name, $options: "i" } 
        },
        { password: 0, token: 0, __v: 0 } 
      );
  
      if (!users.length) {
        return res.status(404).json({
          status: "fail",
          message: "No users found matching the search criteria.",
        });
      }
  
      res.status(200).json({ status: "success", data: users });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  };
  
exports.addUserToAccount = async(req, res)=>{
    try {
        const loggedInUserId = req.user._id ;
        const contactId = req.params.id ;
    
        const contactList  = await Contact.findOne({userId : loggedInUserId}) ;
        if(!contactList){
            await Contact.create({ userId : loggedInUserId , contacts : [contactId]})
        }else {
            if (!contactList.contacts.includes(contactId)){
                contactList.contacts.push(contactId) ;
                await contactList.save()
            }else {
                return res.status(400).json({
                    status: httpStatusText.FAIL,
                    message: 'User is already in your contact list.',
                });
            }
        }
        res.status(200).json({
            status: httpStatusText.SUCCESS,
            message: 'User added to contact list successfully.',
        });
    } catch (error) {
        res.status(500).json({
            status: httpStatusText.ERROR,
            message: error.message,
        });
    }
  

}

exports.removeUserFromContactList = async (req, res) => {
    try {
        const loggedInUserId = req.user._id; // Authenticated user ID
        const contactId = req.params.id; // ID of the user to remove

        const contactList = await Contact.findOne({ userId: loggedInUserId });

        if (!contactList || !contactList.contacts.includes(contactId)) {
            return res.status(404).json({
                status: httpStatusText.FAIL,
                message: 'User not found in your contact list.',
            });
        }

        contactList.contacts = contactList.contacts.filter(
            (id) => id.toString() !== contactId
        );
        await contactList.save();

        res.status(200).json({
            status: httpStatusText.SUCCESS,
            message: 'User removed from contact list successfully.',
        });
    } catch (error) {
        res.status(500).json({
            status: httpStatusText.ERROR,
            message: error.message,
        });
    }
};

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

