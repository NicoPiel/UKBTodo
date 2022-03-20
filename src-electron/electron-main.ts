import { app, BrowserWindow, nativeTheme } from 'electron';
import * as os from 'os';
import * as path from 'path';
import { logger } from './logger/logger';
import { sequelize } from './utility';
import { User } from './orm/entity/user.entity';
import { Todo } from './orm/entity/todo.entity';

// needed in case process is undefined under Linux
const platform = process.platform || os.platform();

try {
    if (platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
        require('fs').unlinkSync(path.join(app.getPath('userData'), 'DevTools Extensions'));
    }
} catch (_) {}

let mainWindow;

function createWindow() {
    /**
     * Initial window options
     */
    mainWindow = new BrowserWindow({
        icon: path.resolve(__dirname, 'icons/icon.png'), // tray icon
        width: 1000,
        height: 600,
        useContentSize: true,
        webPreferences: {
            contextIsolation: true,
            // More info: /quasar-cli/developing-electron-apps/electron-preload-script
            preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),
        },
    });

    mainWindow.loadURL(process.env.APP_URL);

    if (process.env.DEBUGGING) {
        // if on DEV or Production with debug enabled
        mainWindow.webContents.openDevTools();
    } else {
        // we're on production; no access to devtools pls
        mainWindow.webContents.on('devtools-opened', () => {
            mainWindow.webContents.closeDevTools();
        });
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.whenReady().then(async () => {
    createWindow();

    try {
        await sequelize.authenticate();

        try {
            await User.sync({ alter: true });
        } catch (error) {
            logger.log('error', error);
        }

        try {
            await Todo.sync({ alter: true });
        } catch (error) {
            logger.log('error', error);
        }

        try {
            const usersCount = await User.count();

            if (usersCount === 0) {
                try {
                    const result = await sequelize.transaction(async (t) => {
                        try {
                            await User.create({
                                name: 'Dragi',
                                email: 'dragica.kalakovic@ukbonn.de',
                            });
                            await User.create({
                                name: 'Kathi',
                                email: 'katharina.mueller@ukbonn.de',
                            });
                            await User.create({
                                name: 'Hannah',
                                email: 'hannah.langenohl@ukbonn.de',
                            });
                            await User.create({
                                name: 'Ina',
                                email: 'ina.olschewski@ukbonn.de',
                            });
                        } catch (error) {
                            logger.log('error', 'Something went wrong during user creation');
                            logger.log('error', error);
                        }
                    });

                    logger.info('Default users created.');
                } catch (error) {
                    logger.log('error', 'An error occurred while creating the default users.');
                    logger.log('error', error);
                }
            }
        } catch (error) {
            logger.log('error', 'An error occurred while counting the default users.');
            logger.log('error', error);
        }

        logger.info('Database connection established.');
    } catch (error) {
        logger.log('error', 'Connection could not be established.');
    }
});

app.on('window-all-closed', () => {
    if (platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
