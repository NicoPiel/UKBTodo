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
    findTodoById: (id) => Promise<Todo>;
    createTodo: (todo: Todo) => Promise<Todo>;
    updateTodo: (id: number, todo: Todo) => Promise<Todo>;
    deleteTodoById: (id: number) => Promise<number>;
    findAllUsers: () => Promise<User[]>;
    findUserById: (id: number) => Promise<User>;
    reloadFocusedWindow: () => void;
}

declare global {
    interface Window {
        myAPI: IMyAPI;
    }
}

contextBridge.exposeInMainWorld('myAPI', {
    findAllTodos: () => ipcRenderer.invoke('findAllTodos'),
    findTodoById: (id) => ipcRenderer.invoke('findTodoById', id),
    createTodo: (todo: Todo) => ipcRenderer.invoke('createTodo', todo),
    updateTodo: (id: number, todo: Todo) => ipcRenderer.invoke('updateTodo', id, todo),
    deleteTodoById: (id) => ipcRenderer.invoke('deleteTodoById', id),
    findAllUsers: () => ipcRenderer.invoke('findAllUsers'),
    findUserById: (id) => {
        if (id) return ipcRenderer.invoke('findUserById', id);
        return undefined;
    },
    reloadFocusedWindow: () => ipcRenderer.invoke('reloadFocusedWindow'),
});
