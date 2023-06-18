const dotEnv = require('dotenv');
const Sequelize = require('sequelize');

dotEnv.config('../../.env');

module.exports.sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        logging: false,
    },
);
