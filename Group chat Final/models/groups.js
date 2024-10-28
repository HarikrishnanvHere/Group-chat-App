const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Group = sequelize.define("group", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },

  group_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
 
});

module.exports = Group;
