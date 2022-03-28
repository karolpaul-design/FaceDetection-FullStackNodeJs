const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const app = express();
const { PrismaClient, Prisma } = require("@prisma/client");
const register = require("./controllers/register");
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

//sign in --> POST success/fail
app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json("incorrect form submission");
  }
  const emailValidation = await prisma.login.findUnique({
    where: {
      email: email,
    },
  });
  if (emailValidation) {
    const hash = emailValidation.hash;
    const passwordValidation = bcrypt.compareSync(password, hash);
    if (passwordValidation) {
      const user = await prisma.users.findUnique({
        where: {
          email: email,
        },
      });
      res.json(user);
    } else {
      res.status(400).json("wrong password");
    }
  } else {
    res.status(400).json("wrong email");
  }
});

//register --> POST = user
app.post("/register", (req, res) => {
  register.handleRegister(req, res, bcrypt, prisma, Prisma);
});

//profile/:userId --> GET= user
app.get("/profile/:id", async (req, res) => {
  const { id } = req.params;
  if (+id) {
    const user = await prisma.users.findMany({
      where: {
        id: +id,
      },
    });
    if (user.length) {
      res.json(user[0]);
    } else {
      res.status(400).json("user not found");
    }
  } else {
    res.status(400).json("error getting user");
  }
});

//image --> PUT --> user
app.put("/image", async (req, res) => {
  const { id } = req.body;
  try {
    const entries = await prisma.users.update({
      where: {
        id: +id,
      },
      data: {
        entries: {
          increment: 1,
        },
      },
    });
    res.json(entries.entries);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        res.status(400).json("User does not exist");
      }
    }
    res.status(400).json("unable to get entries");
  }
});

app.listen(3000, () => {
  console.log("app is running on port 3000");
});
