module.exports = (sequelize, DataTypes) => {
    const Question = sequelize.define(
        'question',
        {
            questionId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            questionSetId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            question: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            answer1: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            answer2: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            answer3: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            answer4: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            createdAt: {
                type: DataTypes.DATE,
            },
            updatedAt: {
                type: DataTypes.DATE,
            },
        },
        {
            freezeTableName: true,
            timestamps: true,
        },
    );
    return Question;
};
