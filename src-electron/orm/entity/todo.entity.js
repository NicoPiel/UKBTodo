import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../utility';
import { logger } from '../../logger/logger';
import { User } from './user.entity';

export class Todo extends Model {}
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
        } /*
        assigned_to: {
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: 'id',
            },
        },*/,
    },
    {
        sequelize,
        modelName: 'Todo',
    }
);
