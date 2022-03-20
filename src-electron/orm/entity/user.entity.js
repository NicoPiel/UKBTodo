import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../utility';
import { logger } from '../../logger/logger';
import { Todo } from './todo.entity';

export class User extends Model {}

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
        } /*
        todos: {
            type: DataTypes.INTEGER,
            references: {
                model: Todo,
                key: 'id',
            },
        },*/,
    },
    {
        sequelize,
        modelName: 'User',
    }
);
