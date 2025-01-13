const models = require("../models");
const { User, authToken, Post, Comment, Like } = models;

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
      expiresIn: process.env.JWT_EXP,
    });

    await authToken.create({
      token,
      user_id: user.id,
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
    if (parseInt(userId) !== req.user.id) {
      return res.status(403).send("You are not authorized to update this user");
    }

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

    // Check if the authenticated user is trying to delete their own data
    if (parseInt(userId) !== req.user.id) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this user" });
    }

    const deleted = await User.destroy({
      where: { id: userId },
    });

    if (deleted) {
      return res.status(204).json({ message: "User deleted" });
    }
    return res.status(404).json({ message: "User not found" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const createPost = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ error: "You must be logged in to create a post" });
    }

    const user_id = req.user.id;
    const userExists = await User.findOne({ where: { id: user_id } });

    if (!userExists) {
      return res
        .status(500)
        .json({ error: "Create an account to create Post" });
    }
    const post = await Post.create({
      ...req.body,
      user_id: user_id,
    });
    return res.status(200).json({ post });
  } catch (e) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { caption, img_url } = req.body;

    const updates = {};
    if (caption !== undefined) updates.caption = caption;
    if (img_url !== undefined) updates.img_url = img_url;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    const [updated, [updatedPost]] = await Post.update(updates, {
      where: { id: postId, user_id: req.user.id },
      returning: true,
    });

    if (updated) {
      return res.status(200).json({ post: updatedPost });
    }

    return res.status(404).json({ error: "Post not found or not authorized" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const deleted = await Post.destroy({
      where: { id: postId, user_id: req.user.id },
    });

    if (deleted) {
      return res.status(204).send();
    }
    return res.status(404).json({ error: "Post not found or not authorized" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const createComment = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ error: "You must be logged in to comment a post" });
    }
    const { user_id } = req.body;

    const userExists = await User.findOne({ where: { id: user_id } });

    if (!userExists) {
      return res
        .status(500)
        .json({ error: "Create an account to comment a Post" });
    }

    const comment = await Comment.create(req.body);
    return res.status(200).json({ comment });
  } catch (e) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Comment content is required" });
    }

    const [updated] = await Comment.update(
      { content },
      {
        where: { id: commentId, user_id: req.user.id },
      }
    );

    if (updated) {
      const updatedComment = await Comment.findOne({
        where: { id: commentId },
        include: [
          {
            model: User,
            as: "author",
            attributes: ["id", "username", "profile_picture"],
          },
        ],
      });
      return res.status(200).json({ comment: updatedComment });
    }

    return res
      .status(404)
      .json({ error: "Comment not found or not authorized" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const deleted = await Comment.destroy({
      where: { id: commentId, user_id: req.user.id },
    });

    if (deleted) {
      return res.status(204).send();
    }
    return res
      .status(404)
      .json({ error: "Comment not found or not authorized" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const likePost = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ error: "You must be logged in to like a post" });
    }

    const { post_id, user_id } = req.body;

    const userExists = await User.findOne({ where: { id: user_id } });

    if (!userExists) {
      return res
        .status(500)
        .json({ error: "Create an account to create Post" });
    }

    if (!post_id) {
      return res.status(400).json({ error: "Post ID is required" });
    }

    const existingLike = await Like.findOne({
      where: {
        post_id,
        user_id,
      },
    });

    if (existingLike) {
      return res
        .status(400)
        .json({ error: "You have already liked this post" });
    }

    const likeData = await Like.create(req.body);

    const likesCount = await Like.count({
      where: { post_id },
    });

    return res.status(201).json({
      message: "Like added successfully",
      like: likeData,
      likesCount,
    });
  } catch (e) {
    console.error("Error liking post:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getAllPostsWithCommentsAndComments = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res
        .status(404)
        .json({ error: "You must be logged in to view a post" });
    }

    const allPosts = await Post.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: Comment,
          as: "comments",
        },
        {
          model: User,
          as: "author",
        },
        {
          model: Like,
          as: "likes",
        },
      ],
    });

    return res.status(200).json(allPosts);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  registerUser,
  sigInUser,
  deleteUser,
  updateUser,

  createPost,
  updatePost,
  deletePost,

  createComment,
  updateComment,
  deleteComment,
  likePost,

  getAllPostsWithCommentsAndComments,
};
