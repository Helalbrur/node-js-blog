const Role = require('../models/role');

exports.index = async (req, res) => {
  const roles = await Role.findAll();
  res.render('roles/index', { roles });
};

exports.create = async (req, res) => {
  res.render('roles/create');
};

exports.store = async (req, res) => {
  try {
    const { name } = req.body;
    await Role.create({ name });
    res.redirect('/roles');
  } catch (error) {
    res.render('roles/create', { error });
  }
};

exports.edit = async (req, res) => {
  const role = await Role.findByPk(req.params.id);
  if (!role) {
    res.status(404).send('Role not found');
  } else {
    res.render('roles/edit', { role });
  }
};

exports.update = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) {
      res.status(404).send('Role not found');
    } else {
      const { name } = req.body;
      await role.update({ name });
      res.redirect('/roles');
    }
  } catch (error) {
    res.render('roles/edit', { error });
  }
};

exports.destroy = async (req, res) => {
  const role = await Role.findByPk(req.params.id);
  if (!role) {
    res.status(404).send('Role not found');
  } else {
    await role.destroy();
    res.redirect('/roles');
  }
};
