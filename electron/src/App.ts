import ElectronController from "./control/ElectronController";
import {app, ipcMain, IpcMainEvent} from "electron";
import FileController from "./control/FileController";
import {inject, injectable} from "inversify";
import SetupController from "./control/SetupController";
import ModPackController from "./control/ModPackController";
import {Observable, Subscriber} from "rxjs";
import {ConfigurationController} from "./control/ConfigurationController";
import ChangeMcMemoryRequest from "./uitl/ChangeMcMemoryRequest";

@injectable()
export default class App {
    public static app: App

    constructor(
        @inject(ElectronController) public electronController: ElectronController,
        @inject(FileController) public fileController: FileController,
        @inject(SetupController) private setupController: SetupController,
        @inject(ModPackController) private modPackController: ModPackController,
        @inject(ConfigurationController) private configController: ConfigurationController
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

        this.registerFunctionProcess(
            'installMinecraftModPack',
            (subscriber, args) => {
                this.modPackController.install(args)
                    .subscribe(subscriber)
            }
        )

        this.registerFunction('startMinecraftModPack', (event, resolve, reject) => {
            this.fileController.openMinecraftLauncher()
                .then(() => this.configController.updateMcProfiles())
                .then(resolve)
                .catch(reject)
        })

        this.registerFunction("getMaxMemory", ((event, resolve) => {
            this.fileController.getMemoryInfo()
                .then(resolve)
                .catch(console.log)
        }))

        this.registerFunction("changeMemory", (
            event,
            resolve,
            reject,
            args: any
        ) => {
            const request: ChangeMcMemoryRequest = JSON.parse(args)
            this.configController.setMemory(request.modPackId, request.newMemoryValue)
                .then(resolve)
                .catch(console.log)
        })

        this.registerFunction("getCurrentMemory", (event, resolve, reject, args) => {
            this.configController.getCurrentMemory(args)
                .then(resolve)
                .catch(reject)
        })

        this.registerFunction("deleteInstance", ((event, resolve, reject, args: string) => {
            this.modPackController.deleteBy(args)
                .then(resolve)
                .catch(reject)
        }))
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

    registerFunctionProcess(
        name: string,
        functionCallBack: (
            subscriber: Subscriber<any>,
            args: any,
            event: IpcMainEvent
        ) => void
    ): void {
        ipcMain.on(name, (event, args) => {
            new Observable<any>(subscriber => {
                functionCallBack(subscriber, args, event)
            })
                .subscribe({
                    next(value) { event.sender.send(`${name}_next`, value) },
                    complete() { event.sender.send(`${name}_complete`) },
                    error(err) { event.sender.send(`${name}_error`, err)}
                })
        })
    }
}
