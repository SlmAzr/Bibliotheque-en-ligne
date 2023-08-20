const express = require("express");
const app = express();
const { User } = require("./db/mongo");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.post("/api/auth/signup", signUp);
app.post("/api/auth/login", login);

app.get("/", function (req, res) {
  res.send("Hello World");
});

app.listen(4000);

const users = [];

async function signUp(req, res) {
  const body = req.body;
  console.log("body:", body);
  const email = req.body.email;
  const password = req.body.password;

  const userDb = await User.findOne({
    email: email,
  })
  console.log("userDb:", userDb);
  if (userDb != null) {
    res.status(401).send("email déja existant");
    return;
  }
  const user = {
    email: email,
    password: password,
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
  console.log("body:", body);

  const userDb = await User.findOne({
    email: body.email
  });

  if (userDb == null) {
    res.status(401).send("Identifiant ou mot de passe incorrect");
    return;
  }

  const passwordDb = userDb.password;

  if (passwordDb != body.password) {
    res.status(401).send("mauvais mdp");
    return;
  }

  res.send({
    userId: userDb._id,
    token: "tok",
  });
}
