const { DataTypes, DOUBLE } = require('sequelize');
const dotEnv = require('dotenv');
const chalk = require('chalk');
const { sequelize } = require('./database');

dotEnv.config('../../.env');

sequelize
    .authenticate()
    .then(() => console.log(chalk.green(`[DATABASE] "${process.env.DB_NAME}" is connected`)))
    .catch((err) => console.log(err));

const db = {};

db.DataTypes = DataTypes;
db.sequelize = sequelize;

db.user = require('../models/user.model')(sequelize, DataTypes);
db.questionSet = require('../models/questionSet.model')(sequelize, DataTypes);
db.question = require('../models/question.model')(sequelize, DataTypes);

db.questionSet.hasMany(db.question, {
    foreignKey: 'pinNumber',
    onDelete: 'cascade',
});

db.question.belongsTo(db.questionSet, {
    foreignKey: 'pinNumber',
});

sequelize.sync();

module.exports = db;
