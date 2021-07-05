import ElectronController from "./control/ElectronController";
import {app, ipcMain, IpcMainEvent} from "electron";
import FileController from "./control/FileController";
import {inject, injectable} from "inversify";
import SetupController from "./control/SetupController";
import ModPackController from "./control/ModPackController";

@injectable()
export default class App {
    public static app: App

    constructor(
        @inject(ElectronController) public electronController: ElectronController,
        @inject(FileController) public fileController: FileController,
        @inject(SetupController) private setupController: SetupController,
        @inject(ModPackController) private modPackController: ModPackController
    ) {}

    init() {
        this.electronController.createWindow();

        app.on('window-all-closed', app.quit)

        this.registerFunction('checkInstallation', (event, resolve) => {
            this.setupController.isBaseInstalled()
                .then(resolve)
                .catch(console.log)
        })

        this.registerFunction('quit', () => {
            app.quit();
        })

        this.registerFunction('getPath', (event, resolve) => {
            resolve(this.setupController.basePath)
        })

        this.registerFunction('installBase', (event, resolve, reject) => {
            this.setupController.installBase()
                .then(resolve)
                .catch(reject)
        })

        this.registerFunction('getLastModPack', (event, resolve, reject) => {
            this.modPackController.lastModPack
                .then(resolve)
                .catch(reject)
        })

        this.registerFunction('checkModPackInstallation', (event, resolve, reject, args) => {
            this.modPackController.isInstalled(args)
                .then(resolve)
                .catch(console.log)
        })

        this.registerFunction('installMinecraftModPack', (event, resolve, reject, args) => {
            const finished: Array<Promise<any>> = []

            this.fileController.installMinecraftModPack(args, event)
                .then(() => {
                    finished.push(this.fileController.writeConfigurationIntoMinecraftLauncher(args, event))
                    finished.push(this.fileController.copyFilesIntoMinecraftHome(args, event))

                    Promise.all(finished)
                        .then(resolve)
                        .catch(reject)
                })
                .catch(console.log)
        })

        this.registerFunction('startMinecraftModPack', (event, resolve, reject) => {
            this.fileController.openMinecraftLauncher()
                .then(resolve)
                .catch(reject)
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
}
