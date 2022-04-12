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

  if (emailValidation) {
    const hash = await emailValidation.hash;
    const passwordValidation = await bcrypt.compareSync(password, hash);
    res.json(passwordValidation);
    if (passwordValidation) {
      const user = await prisma.users.findUnique({
        where: {
          email: email,
        },
      });
      return res.json(user);
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
