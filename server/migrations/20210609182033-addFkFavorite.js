'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("favorites", "userid", {
      type: Sequelize.INTEGER,
    })

    await queryInterface.addConstraint("favorites", {
      fields: ["userid"],
      type: "foreign key",
      name: "user_fk",
      references: {
        table: "users",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    })

    await queryInterface.addConstraint("users", {
      fields: ["email"],
      type: "unique",
      name: "user_unique_email",
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint("users", "user_unique_email");
    await queryInterface.removeConstraint("favorites", "user_fk");
    await queryInterface.removeColumn("favorites", "userid") 
  }
};
