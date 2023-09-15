const db = require("../models");
const User = db.user;

const loginValidation = async (req, res, next) => {
  const { email } = req.body;
  const findUser = await User.findOne({
    where: {
      surel: email,
    },
  });

  if (!findUser) {
    return res.status(404).json({
      meta: { status: 404, message: `user with ${email} not found` },
    });
  }

  next();
};

module.exports = { loginValidation };
