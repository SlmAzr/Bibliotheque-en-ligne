const { User } = require("../model/User");
const bcrypt = require("bcrypt");
const express = require("express");

async function signUp(req, res) {
  const body = req.body;
  console.log("body:", body);
  const email = req.body.email;
  const password = req.body.password;

  const userDb = await User.findOne({
    email: email,
  });
  console.log("userDb:", userDb);
  if (userDb != null) {
    res.status(401).send("email déja existant");
    return;
  }
  const user = {
    email: email,
    password: hashPassword(password),
  };
  try {
    await User.create(user);
  } catch (e) {
    res.status(500).send("err");
  }
  res.send("Sign up");
}

async function login(req, res) {
  const body = req.body;

  const userDb = await User.findOne({
    email: body.email,
  });

  if (userDb == null) {
    res.status(401).send("Identifiant ou mot de passe incorrect");
    return;
  }

  const passwordDb = userDb.password;

  if (!isPasswordTrue(req.body.password, passwordDb)) {
    res.status(401).send("mauvais mdp");
    return;
  }

  res.send({
    userId: userDb._id,
    token: "tok",
  });
}

function hashPassword(password) {
  console.log(password);
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  console.log(hash);
  return hash;
}

function isPasswordTrue(password, hash) {
  return bcrypt.compareSync(password, hash);
}
const usersRouter = express.Router();

usersRouter.post("signup", signUp);
usersRouter.post("login", login);

module.exports = { usersRouter };
