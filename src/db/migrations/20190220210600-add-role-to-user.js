'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'User',
      'role',
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn( 'User', 'role');
   }
};
