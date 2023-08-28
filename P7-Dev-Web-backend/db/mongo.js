require("dotenv").config();
const mongoose = require("mongoose");

const DB_URL = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@${process.env.DOMAIN}`;

async function connexion() {
  try {
    await mongoose.connect(DB_URL);
    console.log("connected to db");
  } catch (e) {
    console.error(e);
  }
}
connexion();

