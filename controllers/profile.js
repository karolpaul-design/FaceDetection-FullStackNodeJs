const handleProfileData = async (req, res, prisma) => {
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
};
module.exports = {
  handleProfileData: handleProfileData,
};
