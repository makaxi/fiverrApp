import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import createError from "../utils/createError.js";

export const createMessage = async (req, res, next) => {
  const newMessage = new Message({
    conversationId: req.body.conversationId,
    userId: req.userId,
    desc: req.body.desc,
  });

  try{
    const savedMessage = await newMessage.save();
    await Conversation.findOneAndUpdate(
      {id: req.body.conversationId},
      {$set: 
          {readByBuyer: !req.isSeller,
           readBySeller: req.isSeller,
           lastMessage: req.body.desc}
      },
      {new: true}
    );

    res.status(201).send(savedMessage);
  } catch(err) {
    next(err);
  }
};

export const getMessages = async (req, res, next) => {  
  try{
    const messages = await Message.find({conversationId: req.params.id});

    //if(!messages)
    // create new convo 
    res.status(200).send(messages);

  } catch(err) {
    next(err);
  }
};
