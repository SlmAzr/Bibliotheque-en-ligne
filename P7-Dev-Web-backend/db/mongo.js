const mongoose = require("mongoose");

const PASSWORD = "dECySw8dyXBlgrjX";
const USER = "azeamon93";
const DB_URL = `mongodb+srv://${USER}:${PASSWORD}@cluster0.ootv5bg.mongodb.net/?retryWrites=true&w=majority`;
console.log("DB_URL:", DB_URL);

async function connexion() {
    try { 
    await mongoose.connect(DB_URL);
    console.log('connected to db');
    }catch(e){
        console.error(e);
    }
}connexion();

const UserSchema = new mongoose.Schema({
    email: String,
    password: String
})

const User = mongoose.model("User", UserSchema);



module.exports = {User};
