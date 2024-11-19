const User = require('../models/userModel') ;
const {validationResult} = require('express-validator')
const httpStatusText = require("../utils/httpStatusText")

exports.getAllUsers = async(req, res)=>{
   
    const users = await User.find({} ,{"__v" : false , "password ": false}) ; 
    res.json({status : httpStatusText.SUCCESS , data : {users} })
} ;

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

