import { contextBridge, ipcRenderer } from 'electron';
import { Todo, User } from './orm/entity/entities';

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
    findAllTodos: () => Promise<Todo[]>;
    findAllUsers: () => Promise<User[]>;
    findUserById: (id: number) => Promise<User>;
    deleteTodoById: (id: number) => Promise<number>;
    reloadFocusedWindow: () => void;
}

declare global {
    interface Window {
        myAPI: IMyAPI;
    }
}

contextBridge.exposeInMainWorld('myAPI', {
    findAllTodos: () => ipcRenderer.invoke('findAllTodos'),
    findAllUsers: () => ipcRenderer.invoke('findAllUsers'),
    deleteTodoById: (id) => ipcRenderer.invoke('deleteTodoById', id),
    findUserById: (id) => {
        if (id) return ipcRenderer.invoke('findUserById', id);
        return undefined;
    },
    reloadFocusedWindow: () => ipcRenderer.invoke('reloadFocusedWindow'),
});
