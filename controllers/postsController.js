const { Post } = require('../models');

exports.index = async (req, res) => {
  const posts = await Post.findAll({ order: [['createdAt', 'DESC']] });
  res.render('posts/index', { posts });
};

exports.show = async (req, res) => {
  const post = await Post.findByPk(req.params.id);
  if (!post) {
    req.flash('error', 'Post not found.');
    return res.redirect('/posts');
  }
  res.render('posts/show', { post });
};

exports.new = (req, res) => {
  res.render('posts/new');
};

exports.create = async (req, res) => {
  const { title, body } = req.body;
  try {
    const post = await Post.create({ title, body, userId: req.session.user.id });
    req.flash('success', 'Post created successfully!');
    res.redirect(`/posts/${post.id}`);
  } catch (error) {
    req.flash('error', 'There was an error creating the post. Please try again.');
    res.redirect('/posts/new');
  }
};

exports.edit = async (req, res) => {
  const post = await Post.findByPk(req.params.id);
  if (!post) {
    req.flash('error', 'Post not found.');
    return res.redirect('/posts');
  }
  res.render('posts/edit', { post });
};

exports.update = async (req, res) => {
  const { title, body } = req.body;
  const post = await Post.findByPk(req.params.id);
  if (!post) {
    req.flash('error', 'Post not found.');
    return res.redirect('/posts');
  }
  try {
    await post.update({ title, body });
    req.flash('success', 'Post updated successfully!');
    res.redirect(`/posts/${post.id}`);
  } catch (error) {
    req.flash('error', 'There was an error updating the post. Please try again.');
    res.redirect(`/posts/${post.id}/edit`);
  }
};

exports.destroy = async (req, res) => {
  const post = await Post.findByPk(req.params.id);
  if (!post) {
    req.flash('error', 'Post not found.');
    return res.redirect('/posts');
  }
  try {
    await post.destroy();
    req.flash('success', 'Post deleted successfully!');
    res.redirect('/posts');
  } catch (error) {
    req.flash('error', 'There was an error deleting the post. Please try again.');
    res.redirect(`/posts/${post.id}`);
  }
};
