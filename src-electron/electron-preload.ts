import { contextBridge, ipcRenderer } from 'electron';
import { Todo, User } from './orm/entity/entities';
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
    findUserById: (id: number) => User;
}

declare global {
    interface Window {
        myAPI: IMyAPI;
    }
}

contextBridge.exposeInMainWorld('myAPI', {
    findAllTodos: () => {
        logger.info('Finding all todos.');
        return ipcRenderer.invoke('findAllTodos');
    },
    findAllUsers: () => {
        logger.info('Finding all users.');
        return ipcRenderer.invoke('findAllUsers');
    },
    findUserById: (id) => {
        if (id) return ipcRenderer.invoke('findUserById', id);
        return undefined;
    },
});
