import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const verifyToken = async(req, res) => {
  const token = req.cookies.accessToken;
  if(!token) return res.status(401).send("You are not authenticated");

  jwt.verify(token, process.env.JWT_KEY, async (err, payload) => {
    if (err) return res.status(403).send("Token is no longer valid");
    req.userId = payload.id;
    req.isSeller = payload.isSeller;
    
    // (only users should be able to delete their own acct)
    if(payload.id !== user._id.toString()){
      return res.status(403).send("You can only delete your account");
    }
    // if cookies match userID, delete user
    await User.findByIdAndDelete(req.params.id);
    res.status(200).send("Account has been deleted");
  });
};