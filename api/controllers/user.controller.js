import User from "../models/user.model.js";
import createError from "../utils/createError.js";

export const deleteUser = async(req, res, next) => {
  // get id from url request
  const user = await User.findById(req.params.id);

  // make sure id and cookies match (correct permissions)
  // (only users should be able to delete their own acct)
  if(req.userId !== user._id.toString()){
    return next(createError(403, "You can only delete your account"));
  }
  
  // if cookies match userID, delete user
  await User.findByIdAndDelete(req.params.id);
  res.status(200).send("Account has been deleted");
};