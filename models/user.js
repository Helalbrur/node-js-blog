const { DataTypes } = require('sequelize');
const db = require('../config/db');
const bcrypt = require('bcryptjs');

const Post = require('./post');

const User = db.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 2
  }
});

User.prototype.hashPassword = async function() {
  this.password = await bcrypt.hash(this.password, 10);
}

User.hasMany(Post, { onDelete: 'CASCADE' });
Post.belongsTo(User);

module.exports = User;
