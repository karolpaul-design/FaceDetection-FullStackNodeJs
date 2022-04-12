const handleRegister = async (req, res, bcrypt, prisma, Prisma) => {
  const { name, email, password } = await req.body;
  if (!email || !name || !password) {
    return res.status(400).json("incorrect form submition");
  }
  const saltRounds = 10;
  // password hash start
  const salt = await bcrypt.genSaltSync(saltRounds);
  const hash = await bcrypt.hashSync(password, salt);
  // password hash end

  try {
    const user = prisma.users.create({
      data: {
        name: name,
        email: email,
        joined: new Date(),
      },
    });
    const hashDB = prisma.login.create({
      data: {
        email: email,
        hash: hash,
      },
    });
    const result = await prisma.$transaction([user, hashDB]);
    res.json(result[0]);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        res.status(400).json("New user cannot be created with this email");
      }
    }
    res.status(400).json("unable to registrate");
    // throw e;
  }
};

module.exports = {
  handleRegister: handleRegister,
};
