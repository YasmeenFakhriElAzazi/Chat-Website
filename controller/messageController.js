const Conversation = require('../models/conversationModel.js')
const Message = require('../models/messageModel.js') 
const httpStatusText = require("../utils/httpStatusText")
const { getReceiverSocketId, io }  = require("../socket/socket.js") 


exports.sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
	    const { id: receiverId } = req.params;
        console.log(receiverId);
        
	    const senderId = req.user._id;
        let conversation = await Conversation.findOne({
			participants: { $all: [senderId, receiverId] },
		});
        if (!conversation) {
                conversation = await Conversation.create({
                    participants: [senderId, receiverId],
                });
        }

        const newMessage = new Message({
                senderId,
                receiverId : receiverId,
                message,
        });
        console.log(newMessage);
        

        if (newMessage) {
                conversation.messages.push(newMessage._id);
        }
       

        await Promise.all([conversation.save(), newMessage.save()]);

		const receiverSocketId = getReceiverSocketId(receiverId);
		if (receiverSocketId) {
			// io.to(<socket_id>).emit() used to send events to specific client
			io.to(receiverSocketId).emit("newMessage", newMessage);
		}

        res.status(201).json(newMessage);


    } catch (error) {
        return res.status(500).json({status : httpStatusText.ERROR , data : null , message :error.message , code : 500 })
        
    }

};

exports.getMessages = async (req, res) => {
	try {
		const { id: userToChatId } = req.params;
		const senderId = req.user._id;

		const conversation = await Conversation.findOne({
			participants: { $all: [senderId, userToChatId] },
		}).populate("messages"); 

		if (!conversation) return res.status(200).json([]);

		const messages = conversation.messages;

		res.status(200).json(messages);
	} catch (error) {
        return res.status(500).json({status : httpStatusText.ERROR , data : null , message :error.message , code : 500 })
	}
};