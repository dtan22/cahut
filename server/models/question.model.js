module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
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
            answer: {
                type: new DataTypes.ARRAY(DataTypes.STRING),
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
            // freezeTableName: true,
            // timestamps: true,
        },
    );
};
