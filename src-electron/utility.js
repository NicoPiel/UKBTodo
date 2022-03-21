import * as path from 'path';
import { Sequelize } from 'sequelize';
import { logger } from './logger/logger';
import { app } from 'electron';

export const DB_PATH = path.join(app.getAppPath(), 'db.db3');

export let sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: DB_PATH,
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
