module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'questionSet',
        {
            questionSetId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            questionSetName: {
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
            // freezeTableName: true,
            // timestamps: true,
        },
    );
};
