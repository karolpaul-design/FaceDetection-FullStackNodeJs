const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const app = express();
const { PrismaClient, Prisma } = require("@prisma/client");
const register = require("./controllers/register");
const signIn = require("./controllers/signIn");
const profileData = require("./controllers/profile");
const image = require("./controllers/image");
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

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

app.listen(3000, () => {
  console.log("app is running on port 3000");
});
