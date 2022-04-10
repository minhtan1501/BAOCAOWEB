const User = require('../models/userModel')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Payments = require("../models/paymentsModels")
const userCtrl = {
  register: async (req, res, next) => {
    try {
      const { name, email, password } = req.body;

      const user = await User.findOne({ email });
      if (user) return res.status(400).json({ message: "The email already exists" });

      if (password < 8)
        return res
          .status(400)
          .json({ message: "Password is at least 6 charaters long" });

      // Password Encryption
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = new User({
        name,
        email,
        password: passwordHash,
      });
      // Save mongoDB
      await newUser.save();

      // then create jsontokenweb
      const accessToken = createAccessToken({ id: newUser._id });
      const refreshtoken = createRefreshToken({ id: newUser._id });
      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: '/user/refresh_token',
        maxAge: 7*24*60*60*1000
      });

      res.json({accessToken: accessToken})
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
  refreshtoken: (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;

      if (!rf_token)
        return res.status(400).json({ message: "Please Login or Register" });

      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err)
          return res.status(400).json({ msg: "Please Login or Register" });
        const accessToken = createAccessToken({ id: user.id });

        res.json({ user, accessToken });
      });

    } catch (err) {
      return res.status(500).json({ message: err });
    }
  },
  login: async (req, res, next) => {
    try {
      const {email, password} = req.body;
      const user = await User.findOne({ email: email});

      if(!user) return res.status(400).json({ message: "User dose not exits"});

      const isMatch = await bcrypt.compare(password, user.password);
      if(!isMatch) return res.status(400).json({ message:"Incorrect password."});

      // if Login successful, create access token and refresh token
      const accessToken = createAccessToken({ id: user._id });
      const refreshtoken = createRefreshToken({ id: user._id });
      res.clearCookie("refreshtoken",{path: "/user/refresh_token"})

      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: '/user/refresh_token',
        maxAge: 7*24*60*60*1000
      });
      res.json({accessToken: accessToken})
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
  logout: async (req, res, next) => {
    try {
      res.clearCookie("refreshtoken",{path: "/user/refresh_token"})
       return res.end();
    }
    catch (err) {
      return res.status(500).json({ message: err });
    }
  },
  getUser: async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      if(!user) return res.status(404).json({message: "User dose not exist"});

      res.status(200).json(user)

    }
    catch (err) {
      return res.status(500).json({ message: err });
    }
  },
  addCart: async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      if(!user) return res.status(404).json({message: "User does not exist"});
      await User.findOneAndUpdate({_id: req.user.id},{
        cart: req.body
      })
      return res.status(200).json({ message: "Added to cart"})
    }catch (err) {
      return res.status(500).json({ message: err });
    }
  },
  history: async (req, res,next) => {
      try {
        const history = await Payments.find({user_id: req.user.id})

        res.json(history)
      }catch (err) {
        return res.status(500).json({ message: err.message})
      }
  }
};

const createAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
};

const createRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

module.exports = userCtrl;
