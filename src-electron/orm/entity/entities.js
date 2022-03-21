import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../utility';

// Models

class User extends Model {}
User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'User',
    }
);

class Todo extends Model {}
Todo.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
        },
        description: {
            type: DataTypes.STRING,
        },
        issued_by: {
            type: DataTypes.STRING,
        },
        deadline: {
            type: DataTypes.DATEONLY,
        },
    },
    {
        sequelize,
        modelName: 'Todo',
    }
);

// Relationships

/*User.hasMany(Todo);
Todo.belongsTo(User, {
    foreignKey: {
        name: 'assigned_to',
    },
});*/

// Export

export { User, Todo };
