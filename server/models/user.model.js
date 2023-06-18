module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'user',
        {
            username: {
                type: DataTypes.STRING,
                primaryKey: true,
            },
            password: {
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
