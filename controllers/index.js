const models = require("../models");
const { User } = models;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { username, email, password, profile_picture } = req.body;

    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      return res
        .status(400)
        .json({ error: "Email is already associated with another user." });
    }

    const signUp = await User.create({
      username,
      email,
      password: await bcrypt.hash(password, 15),
      profile_picture,
    });

    return res.status(200).json({ signUp });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const sigInUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json("User Not Found!");
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.json("Invalid Password").status(404);
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_KEY, {
      expiresIn: `${process.env.JWT_EXP}`,
    });

    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      accessToken: token,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const [updated] = await models.User.update(req.body, {
      where: { id: userId },
    });
    if (updated) {
      const updatedUser = await User.findOne({ where: { id: userId } });
      return res.status(200).json({ user: updatedUser });
    }
    throw new Error("User not found");
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const deleted = await User.destroy({
      where: { id: userId },
    });

    if (deleted) {
      return res.status(204).json({ message: "User deleted" });
    }
    return res.status(500).json({ message: "User not found" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { registerUser, sigInUser, deleteUser, updateUser };
