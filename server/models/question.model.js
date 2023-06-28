module.exports = (sequelize, DataTypes) => {
    const Question = sequelize.define(
        'question',
        {
            pinNumber: {
                type: DataTypes.INTEGER,
                primaryKey: true,
            },
            questionNumber: {
                type: DataTypes.INTEGER,
                primaryKey: true,
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
            correctAnswer: {
                type: DataTypes.INTEGER,
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
