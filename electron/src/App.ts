import ElectronController from "./control/ElectronController";
import {app, ipcMain, IpcMainEvent} from "electron";
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

        this.registerFunction('getLastModPack', (event, resolve) => {
            resolve(this.fileController.getLastModPack());
        })
    }

    registerFunction(
        name: string,
        functionCallBack: (
            event: IpcMainEvent,
            resolve: (value: any) => void,
            reject: (err: Error) => void
        ) => void
    ): void {
        ipcMain.on(name, (event: IpcMainEvent) => {
            new Promise((resolve, reject) => {
                functionCallBack(event, resolve, reject)
            })
                .then(value => event.sender.send(name, value))
        })
    }
}
