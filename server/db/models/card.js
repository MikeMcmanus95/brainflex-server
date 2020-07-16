const Sequelize = require('sequelize');
const db = require('../db');

const Card = db.define('card', {
  question: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  answer: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  isKnown: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  category: {
    type: Sequelize.STRING,
  },
});

module.exports = Card;
