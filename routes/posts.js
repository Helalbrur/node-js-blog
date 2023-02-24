const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { ensureAuthenticated } = require('../middlewares/auth');
const { Post, User } = require('../models');

router.get('/', ensureAuthenticated, async (req, res) => {
  const posts = await Post.findAll({ include: User });
  res.render('posts/index', { title: 'Posts', posts });
});

router.get('/new', ensureAuthenticated, (req, res) => {
  res.render('posts/new', { title: 'New Post' });
});

router.post('/', ensureAuthenticated, [
  check('title').notEmpty(),
  check('content').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    res.render('posts/new', { title: 'New Post', errors: errorMessages });
  } else {
    const { title, content } = req.body;
    const post = await Post.create({ title, content, UserId: req.user.id });
    res.redirect(`/posts/${post.id}`);
  }
});

router.get('/:id', ensureAuthenticated, async (req, res) => {
  const post = await Post.findByPk(req.params.id, { include: User });
  if (post) {
    res.render('posts/show', { title: post.title, post });
  } else {
    res.status(404).render('404', { title: 'Not Found' });
  }
});

router.get('/:id/edit', ensureAuthenticated, async (req, res) => {
  const post = await Post.findByPk(req.params.id);
  if (post) {
    res.render('posts/edit', { title: 'Edit Post', post });
  } else {
    res.status(404).render('404', { title: 'Not Found' });
  }
});

router.patch('/:id', ensureAuthenticated, [
  check('title').notEmpty(),
  check('content').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    const post = await Post.findByPk(req.params.id);
    res.render('posts/edit', { title: 'Edit Post', post, errors: errorMessages });
  } else {
    const { title, content } = req.body;
    const post = await Post.findByPk(req.params.id);
    await post.update({ title, content });
    res.redirect(`/posts/${post.id}`);
  }
});

router.delete('/:id', ensureAuthenticated, async (req, res) => {
  const post = await Post.findByPk(req.params.id);
  await post.destroy();
  res.redirect('/posts');
});

module.exports = router;
