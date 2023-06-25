module.exports = (sequelize, DataTypes) => {
    const QuestionSet = sequelize.define(
        'questionSet',
        {
            questionSetId: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                primaryKey: true
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            questionSetName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            state: {
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
    return QuestionSet
};
