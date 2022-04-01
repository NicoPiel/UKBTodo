import * as path from 'path';
import { Sequelize } from 'sequelize';
import { logger } from './logger/logger';
import { app } from 'electron';

export const DB_PATH_DEBUG = path.join(app.getAppPath(), 'db.db3');
export const DB_PATH = path.join(app.getPath('exe').slice(0, -12), 'db.db3');

export let sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DEBUGGING ? DB_PATH_DEBUG : DB_PATH,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});

(async () => {
    logger.info('Authenticating..');
    await sequelize.authenticate();

    console.log('DB File: ' + DB_PATH);
    logger.info('Database connection established.');
})();
