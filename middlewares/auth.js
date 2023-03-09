const express = require("express");
const jwt = require("jsonwebtoken");

const config = require("config");
const JwtKey = config.get("JwtKey");

const { redisClient } = require("../database/db")
const nodemailer = require("nodemailer")

const authMiddleware = async (req, res, next) => {
  const token = req.headers["x-auth-token"];

  if (!token) {
    console.log("no token found ");
    return res.status(401).json({ msg: "No token auth denied" });
  }

  try {
    const decode = jwt.verify(token, JwtKey);
    req.user = decode;
    next();
  } catch (err) {
    console.log("err in auth middleware ");
    return res.status(401).json({ msg: "token is not valid " });
  }
};

// middleware function to send reset link
const sendResetLink = (req, res) => {
  const userEmail = req.body.email;

  // generate unique URL path
  const resetPath = Math.random().toString(36).slice(2);

  // store reset token in Redis with expiration time and associate with URL path
  redisClient.setex(resetPath, 3600, userEmail);
  redisClient.setex(userEmail, 3600, resetPath);

  // configure nodemailer transport
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // create email message with unique URL path
  const resetUrl = `${req.headers.origin}/resetPassword/${resetPath}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: "Reset Your Password",
    text: `Please click on the following link to reset your password: ${resetUrl}`,
  };

  // send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: "Error sending reset link" });
    } else {
      console.log(`Reset link sent to ${userEmail}`);
      res.status(200).json({ message: "Reset link sent" });
    }
  });
}

module.exports = {authMiddleware, sendResetLink};
