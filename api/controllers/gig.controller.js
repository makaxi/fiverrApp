import Gig from "../models/gig.model.js";
import createError from "../utils/createError.js";

export const createGig = async (req, res, next) => {
  if(!req.isSeller) return next(createError(403, "Only sellers can create a gig"));

  const newGig = new Gig({
   userId: req.userId,
   ...req.body,
  });

  try{
    const savedGig = await newGig.save();
    res.status(201).json(savedGig);
  } catch(err) {
    next(err);
  }
};

export const deleteGig = async (req, res, next) => {
  //get gigID from request
  //check userID matches the gig's UserID
  //if true, DELETE(gigID)
  //else return error

  try{
    const gig = await Gig.findById(req.params.id);
    if(!gig) return next(createError(404, "No gig found with that ID"));
    if(req.userId !== gig.userId)
      return next(createError(403, "You can only delete your own gigs"));

    await Gig.findByIdAndDelete(req.params.id);
    res.status(200).send("Gig has been deleted");
  } catch(err){
    next(err);
  }
};

export const getGig = async (req, res, next) => {
  try{
    const gig = await Gig.findById(req.params.id);
    if(!gig) next(createError(404, "No gig found with that ID"));
    res.status(200).send(gig);
  } catch(err){
    next(err);
  }
};

export const getGigs = async (req, res, next) => {
  const q = req.query;
  const filters = {
    ...(q.userId && {userId: q.userId}),
    ...(q.cat && {cat: q.cat}),
    ...((q.min || q.max) && {
      price: {...(q.min && {$gt: q.min}), ...(q.max && {$lt: q.max})}
    }),
    ...(q.search && {title: {$regex: q.search, $options: "i"}}),
  };

  try{
    const gigs = await Gig.find(filters);
    if(!gigs) next(createError(404, "There are currently no gigs"));
    res.status(200).send(gigs);
  } catch(err){
    next(err);
  }
};
