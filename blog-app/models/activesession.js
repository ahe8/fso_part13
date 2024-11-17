const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class ActiveSession extends Model { }

ActiveSession.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    authToken: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
    },
    createdAt: {
        type: DataTypes.DATE
    },
    updatedAt: {
        type:DataTypes.DATE
    }
}, {
    sequelize,
    underscored: true,
    modelName: 'activeSession'
})

module.exports = ActiveSession