const { response } = require("express");

const handleSignIn = async (req, res, prisma, bcrypt) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json("incorrect form submission");
  }
  const emailValidation = await prisma.login.findUnique({
    where: {
      email: email,
    },
  });
  res.json(emailValidation);
  if (emailValidation) {
    const hash = emailValidation.hash;
    const passwordValidation = bcrypt.compareSync(password, hash);
    if (passwordValidation) {
      try {
        const user = await prisma.users.findUnique({
          where: {
            id: 2,
          },
        });
        res.json(user);
      } catch (e) {
        response.status(400).json(e);
      }
      res.json("user2");
    } else {
      res.status(400).json("wrong password");
    }
  } else {
    res.status(400).json("wrong email");
  }
};

module.exports = {
  handleSignIn: handleSignIn,
};
