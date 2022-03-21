import { contextBridge, ipcRenderer } from 'electron';
import { User, Todo } from './orm/entity/entities';
import { logger } from './logger/logger';

/**
 * This file is used specifically for security reasons.
 * Here you can access Nodejs stuff and inject functionality into
 * the renderer thread (accessible there through the "window" object)
 *
 * WARNING!
 * If you import anything from node_modules, then make sure that the package is specified
 * in package.json > dependencies and NOT in devDependencies
 *
 * Example (injects window.myAPI.doAThing() into renderer thread):
 *
 *   import { contextBridge } from 'electron'
 *
 *   contextBridge.exposeInMainWorld('myAPI', {
 *     doAThing: () => {}
 *   })
 */

export interface IMyAPI {
    findAllTodos: () => Todo[];
    findAllUsers: () => User[];
}

declare global {
    interface Window {
        myAPI: IMyAPI;
    }
}

contextBridge.exposeInMainWorld('myAPI', {
    findAllTodos: async () => {
        logger.info('Finding all todos.');
        return ipcRenderer.invoke('findAllTodos');
    },
    findAllUsers: async () => {
        logger.info('Finding all users.');
        return ipcRenderer.invoke('findAllUsers');
    },
});
