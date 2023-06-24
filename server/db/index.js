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
db.room = require('../models/room.model')(sequelize, DataTypes);

db.questionSet.hasMany(db.question, {
    foreignKey: 'questionSetId',
    onDelete: 'cascade',
});

db.question.belongsTo(db.questionSet, {
    foreignKey: 'questionSetId',
});

db.questionSet.hasMany(db.room, {
    foreignKey: 'questionSetId',
    onDelete: 'cascade',
});

db.room.belongsTo(db.questionSet, {
    foreignKey: 'questionSetId',
});

db.user.hasMany(db.room, {
    foreignKey: 'username',
    onDelete: 'cascade',
});

db.room.belongsTo(db.user, {
    foreignKey: 'username',
});

sequelize.sync();

module.exports = db;
