import ElectronController from "./control/ElectronController";
import {app, ipcMain, ipcRenderer, IpcMainEvent} from "electron";
import FileController from "./control/FileController";

export default class App {
    static readonly app: App = new App();
    readonly electronController: ElectronController = new ElectronController();
    readonly fileController: FileController = new FileController();

    init() {
        this.electronController.createWindow();

        app.on('window-all-closed', app.quit)

        this.registerFunction('checkInstallation', (event, resolve) => {
            this.fileController.checkInstallation()
                .then(isInstalled => resolve(isInstalled))
                .catch(console.log)
        })

        this.registerFunction('quit', () => {
            app.quit();
        })

        this.registerFunction('getPath', (event, resolve) => {
            resolve(this.fileController.installPath.toString())
        })

        this.registerFunction('installBase', (event, resolve, reject) => {
            this.fileController.installBase()
                .then(() => resolve(null))
                .catch(err => reject(err));
        })

        this.registerFunction('getLastModPack', (event, resolve, reject) => {66
            this.fileController.getLastModPack()
                .then(resolve)
                .catch(reject)
        })

        this.registerFunction('checkModPackInstallation', (event, resolve, reject, args) => {
            this.fileController.checkModPackInstallation(args)
                .then(resolve)
                .catch(console.log)
        })

        this.registerFunction('installMinecraftModPack', (event, resolve, reject, args) => {
            const finished: Array<Promise<any>> = []

            this.fileController.installMinecraftModPack(args)
                .then(() => {
                    finished.push(this.fileController.writeConfigurationIntoMinecraftLauncher(args))
                    finished.push(this.fileController.copyFilesIntoMinecraftHome(args))

                    Promise.all(finished)
                        .then(resolve)
                        .catch(reject)
                })
                .catch(console.log)
        })
    }

    registerFunction(
        name: string,
        functionCallBack: (
            event: IpcMainEvent,
            resolve: (value: any) => void,
            reject: (err: Error) => void,
            args: any
        ) => void
    ): void {
        ipcMain.on(name, (event: IpcMainEvent, args: any) => {
            new Promise((resolve, reject) => {
                functionCallBack(event, resolve, reject, args)
            })
                .then(value => event.sender.send(name, value))
                .catch(console.log)
        })
    }

    send(channel: string, ...args: any[]) {
        ipcRenderer.send(channel, args)
    }
}
