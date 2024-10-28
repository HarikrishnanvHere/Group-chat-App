const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const GroupUser = sequelize.define("group_users", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  isAdmin: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
});

module.exports = GroupUser;
