module.exports = (sequelize, DataTypes) => {
    const Room = sequelize.define(
        'room',
        {
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true,
            },
            roomName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            pinNumber: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true,
            },
            isOpen: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
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
    return Room;
};
