const { DataTypes } = require('sequelize')

module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('active_sessions', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            auth_token: {
                type: DataTypes.TEXT,
                allowNull: false,
                unique: true
            },
            created_at: {
                type: DataTypes.DATE
            },
            updated_at: {
                type:DataTypes.DATE
            }
        })
        await queryInterface.addColumn('users', 'disabled', {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        })
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.dropTable('active_sessions')
        await queryInterface.removeColumn('users', 'disabled')
    },
}