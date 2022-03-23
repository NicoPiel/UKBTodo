import { app, BrowserWindow, ipcMain, nativeTheme, session } from 'electron';
import * as os from 'os';
import * as path from 'path';
import { logger } from './logger/logger';
import { sequelize } from './utility';
import { Todo, User } from './orm/entity/entities';

// needed in case process is undefined under Linux
const platform = process.platform || os.platform();

try {
    if (platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
        require('fs').unlinkSync(path.join(app.getPath('userData'), 'DevTools Extensions'));
    }
} catch (_) {}

// Catch events

function catchEvents() {
    ipcMain.handle('findAllTodos', () => {
        logger.info('handling findAllTodos event');
        return Todo.findAll();
    });
    ipcMain.handle('findAllUsers', () => {
        logger.info('handling findAllUsers event');
        return User.findAll();
    });
}

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
    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
        callback({
            responseHeaders: {
                ...details.responseHeaders,
                'Content-Security-Policy': [
                    "default-src 'none'" +
                        " script-src 'self'" +
                        " connect-src 'self'" +
                        " img-src 'self'" +
                        " style-src 'self' 'unsafe-inline'" +
                        " font-src 'self'",
                ],
            },
        });
    });

    catchEvents();
    await setup();

    createWindow();
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

async function setup() {
    try {
        try {
            await User.sync({ alter: true });
        } catch (error) {
            logger.log('error', 'Something went wrong while syncing Users.');
            logger.log('error', error);
        }

        try {
            await Todo.sync({ alter: true });
        } catch (error) {
            logger.log('error', 'Something went wrong while syncing Todos.');
            logger.log('error', error);
        }

        await createDefaultUsers();

        if (process.env.DEBUGGING) await createDefaultTodos();

        logger.info('Done.');
    } catch (error) {
        logger.log('error', 'Connection could not be established.');
    }
}

async function createDefaultUsers() {
    const usersCount = await User.count();

    if (usersCount == 0) {
        try {
            await sequelize.transaction(async (t) => {
                try {
                    await User.create({
                        name: 'Dragi',
                        email: 'dragica.kalakovic@ukbonn.de',
                    });
                    await User.create({
                        name: 'Katharina',
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
}

async function createDefaultTodos() {
    const todoCount = await Todo.count();

    if (todoCount == 0) {
        try {
            await sequelize.transaction(async (t) => {
                for (let i = 0; i < 30; i++) {
                    try {
                        await Todo.create({
                            description: 'Beispiel',
                            issued_by: 'Beispiel',
                        });
                    } catch (error) {
                        logger.log('error', 'Something went wrong during todo creation');
                        logger.log('error', error);
                    }
                }
            });

            logger.info('Default todos created.');
        } catch (error) {
            logger.log('error', 'An error occurred while creating the default todos.');
            logger.log('error', error);
        }
    }
}
