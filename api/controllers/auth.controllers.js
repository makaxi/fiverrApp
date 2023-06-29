import User from "../models/user.model.js";

export const register = async(req, res) => {
  res.send("hello");
  try{
    const newUser = new User({
      username: "test",
      email: "test",
      password: "test",
      country: "test",
    });
    
    await newUser.save();
    res.status(201).send("User has been created.");
  } catch(err){
    res.status(500).send("something went wrong");
  }
};

export const login = async(req, res) => {
  try{

    res.status(201).send("User has logged in");
  } catch(err){
    res.status(500).send("something went wrong");
  }
};

export const logout = async(req, res) => {
  try{
    
    res.status(201).send("logged out successfully");
  } catch(err){
    res.status(500).send("something went wrong");
  }
};
