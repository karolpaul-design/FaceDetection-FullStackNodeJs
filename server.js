const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const app = express();
const { PrismaClient, Prisma } = require("@prisma/client");
const { Client } = require("pg");
const prisma = new PrismaClient();

const register = require("./controllers/register");
const signIn = require("./controllers/signIn");
const profileData = require("./controllers/profile");
const image = require("./controllers/image");
const path = require("path");
const client = new Client({
  connectionString:
    "postgres://oraliljzbwfvfh:c1ed25bca688e918d587bf5556e155a0c040b6820bb45409e1cd6550afcc4646@ec2-54-228-32-29.eu-west-1.compute.amazonaws.com:5432/devnh7mqnr2cdq",
  ssl: {
    rejectUnauthorized: false,
  },
});
client.connect();
console.log(client);
client.query(
  "SELECT table_schema,table_name FROM information_schema.tables;",
  (err, res) => {
    if (err) throw err;
    for (let row of res.rows) {
      console.log(JSON.stringify(row));
    }
    client.end();
  }
);
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname + "/public")));

//sign in --> POST success/fail
app.post("/signin", (req, res) => {
  signIn.handleSignIn(req, res, prisma, bcrypt);
});

//register --> POST = user
app.post("/register", (req, res) => {
  register.handleRegister(req, res, bcrypt, prisma, Prisma);
});

//profile/:userId --> GET= user
app.get("/profile/:id", (req, res) => {
  profileData.handleProfileData(req, res, prisma);
});

//image --> PUT --> user
app.put("/image", (req, res) => {
  image.handleImages(req, res, prisma, Prisma);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});
