const handleImages = async (req, res, prisma, Prisma) => {
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
};

module.exports = {
  handleImages: handleImages,
};
