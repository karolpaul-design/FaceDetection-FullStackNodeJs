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
  if (true) {
    // const hash = emailValidation.hash;
    // const passwordValidation = bcrypt.compareSync(password, hash);
    // if (passwordValidation) {
    const user = await prisma.users.findMany();
    // .findUnique({
    //   where: {
    //     email: email,
    //   },
    // });
    res.json(user);
    // } else {
    //   res.status(400).json("wrong password");
    // }
  } else {
    res.status(400).json("wrong email");
  }
};

module.exports = {
  handleSignIn: handleSignIn,
};
