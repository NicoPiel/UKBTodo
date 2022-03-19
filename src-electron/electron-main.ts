import { app, BrowserWindow, nativeTheme } from 'electron';
import * as os from 'os';
import { DataTypes, Sequelize } from 'sequelize';
import * as path from 'path';
import { logger } from './logger/logger';

// needed in case process is undefined under Linux
const platform = process.platform || os.platform();

try {
  if (platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(
      path.join(app.getPath('userData'), 'DevTools Extensions')
    );
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

  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'db.db3'),
  });

  try {
    await sequelize.authenticate();
    logger.info('Connection has been established successfully.');
  } catch (error) {
    logger.log('error', "Couldn't connect to database");
    logger.log('error', error);
  }

  try {
    const User = sequelize.define('User', {
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
    });

    const Todo = sequelize.define('Todo', {
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
      assigned_to: {
        type: DataTypes.INTEGER,
        references: {
          model: User,
          key: 'id',
        },
      },
    });

    await sequelize.sync();
    logger.info('Database synchronised successfully.');

    const usersCount = await User.count();

    if (usersCount === 0) {
      try {
        const result = await sequelize.transaction(async (t) => {
          await User.create({
            name: 'Dragi',
            email: 'dragica.kalakovic@ukbonn.de',
          });
        });

        logger.info('Default users created.');
      } catch (error) {
        logger.log(
          'error',
          'An error occurred while creating the default users.'
        );
        logger.log('error', error);
      }
    }
  } catch (error) {
    logger.log('error', 'An error occurred while creating the default users.');
    logger.log('error', error);
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
