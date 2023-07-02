import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const deleteUser = async(req, res) => {
  // check cookies/json webtoken
  const token = req.cookies.accessToken;

  // get id from url request
  const user = await User.findById(req.params.id);

  // make sure id and cookies match (correct permissions)
  jwt.verify(token, process.env.JWT_KEY, async (err, payload) => {
    // (only users should be able to delete their own acct)
    if(payload.id !== user._id.toString()){
      return res.status(403).send("You can only delete your account");
    }
    // if cookies match userID, delete user
    await User.findByIdAndDelete(req.params.id);
    res.status(200).send("Account has been deleted");
  });
};