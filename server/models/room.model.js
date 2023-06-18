module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'room',
        {
            roomId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            roomName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            pinNumber: {
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
