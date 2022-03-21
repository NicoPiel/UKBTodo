import { contextBridge } from 'electron';
import { User, Todo } from './orm/entity/entities';

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

contextBridge.exposeInMainWorld('db', {
    findAllTodos: (): Todo[] => {
        return Todo.findAll();
    },
    findAllUsers: (): User[] => {
        return User.findAll();
    },
});
