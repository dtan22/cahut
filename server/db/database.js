const dotEnv = require('dotenv');
const Sequelize = require('sequelize');

dotEnv.config('../../.env');

module.exports.sequelize = new Sequelize("sqlite::memory:");