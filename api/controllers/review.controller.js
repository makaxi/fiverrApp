import Review from "../models/review.model.js";
import Gig from "../models/gig.model.js";
import createError from "../utils/createError.js";

export const createReview = async (req, res, next) => {
  // if buyer has not bought this gig
  // they can't create a review for the item

  // if user is a buyer, they can't leave a review
  if(req.isSeller) 
    return next(createError(403, "Sellers can't leave a review"));
  
  // else create gig
  const newReview = new Review({
    userId: req.userId,
    ...req.body
/*     gigId: req.body.gigId,
    desc: req.body.desc,
    star: req.body.star */
  });
  
  // save to database
  try{
    // if user has written a review already, 
    // they shouldn't be allowed to write another one for the same gig
    const review = await Review.findOne({
      gigId: req.body.gigId,
      userId: req.userId
    })

    if(review) 
      return next(createError(403, "You've already written a review for this gig"));

    const savedReview = await newReview.save();

    await Gig.findByIdAndUpdate(req.body.gigId, {
      $inc: {totalStars: req.body.star, starNumber: 1}
    });

    res.status(201).send(savedReview);
  } catch(err) {
    next(err);
  }
};

export const getReviews = async (req, res, next) => {
  try{
    const review = await Review.find({gigId: req.params.gigId});
    if(!review) next(createError(404, "No such review"));
    res.status(200).send(review);
  } catch(err) {
    next(err);
  }
};

export const deleteReview = async (req, res, next) => {
  try{
    const review = await Review.findById(req.params.id);
    if(!review) return next(createError(404, "No review found with that ID"));
    if(req.userId !== review.userId)
      return next(createError(403, "You are not authenticated to delete this review"));
    await Review.findByIdAndDelete(req.params.id);
    res.status(200).send("Review has been deleted");
  } catch(err) {
    next(err);
  }
};
