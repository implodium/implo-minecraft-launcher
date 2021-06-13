import ElectronController from "./control/ElectronController";
import {app, ipcMain} from "electron";
import FileController from "./control/FileController";

export default class App {
    static readonly app: App = new App();
    readonly electronController: ElectronController = new ElectronController();
    readonly fileController: FileController = new FileController();

    init() {
        this.electronController.createWindow();

        app.on('window-all-closed', app.quit)

        ipcMain.on('checkInstallation', event => {
            this.fileController.checkInstallation()
                .then(isInstalled => event.sender.send('checkInstallation', isInstalled))
                .catch(console.log)
        })

        ipcMain.on('quit', () => {
            app.quit();
        })

        ipcMain.on('getPath', event => {
            event.sender.send('getPath', this.fileController.installPath.toString())
        })

        ipcMain.on('installBase', event => {
            this.fileController.installBase()
                .then(() => event.sender.send('installBase'))
                .catch(console.log);
        })
    }
}
