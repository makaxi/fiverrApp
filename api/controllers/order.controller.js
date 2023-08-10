import Order from "../models/order.model.js";
import Gig from "../models/gig.model.js";
import createError from "../utils/createError.js";

export const createOrder = async (req, res, next) => {
  try{
    const gig = await Gig.findById(req.params.gigId);
    
    const newOrder = new Order({
      gigId: gig._id,
      img: gig.cover,
      title: gig.title,
      price: gig.price,
      sellerId: gig.userId,
      buyerId: req.userId,
      payment_intent: "temp_string",
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);

  } catch(err) {
    next(err);
  }
};

export const getOrders = async (req, res, next) => {
  try{
    //get all the orders for this gig
    const orders = await Order.find({
      ...(req.isSeller ? {sellerId: req.userId} : {buyerId: req.userId}), 
      isCompleted: true,
    });

    //if(!orders) next(createError(404, "This user has no orders"));

    res.status(200).send(orders);
  } catch(err) {
    next(err);
  }
};
