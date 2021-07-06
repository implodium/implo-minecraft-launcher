import * as os from "os";
import Path from "../uitl/Path";
import * as fs from "fs";
import * as wget from 'wget-improved'
import {IpcMainEvent} from 'electron'
import * as child_process from 'child_process'
import InstallationStatus from "../uitl/InstallationStatus";
import {injectable} from "inversify";
import LauncherConfiguration from "../uitl/LauncherConfiguration";
import {Observable} from "rxjs";
const fsExtra = require('fs-extra')
const zip = require('onezip')

@injectable()
export default class FileController {
    private readonly installationPaths = {
        mac: new Path(`/Users/${os.userInfo().username}/Library/ApplicationSupport/.implo-launcher/`),
        win: new Path(`C:\\Users\\${os.userInfo().username}\\AppData\\Roaming\\.implo-launcher\\`)
    }

    private readonly mineCraftHomePaths = {
        mac: new Path(`/Users/${os.userInfo().username}/Library/ApplicationSupport/minecraft/`),
        win: new Path(`C:\\Users\\${os.userInfo().username}\\AppData\\Roaming\\.minecraft\\`)
    }

    private readonly mineCraftLauncherPaths = {
        mac: new Path('/Applications/Minecraft.app'),
        win: new Path('C:\\Program Files (x86)\\Minecraft Launcher\\')
    }

    private installPercentage: number = 0

    installBase(config: LauncherConfiguration): Promise<void[]> {
        let finished: Array<Promise<void>> = []
        finished.push(new Promise((resolve, reject) => {
            fs.mkdir(this.installPath.toString(), (err: any) => {
                if (!err) {
                    resolve()
                    finished.push(new Promise((resolve, reject) => {
                        fs.writeFile(this.installPath.relativeToPath('launcher-config.json'), JSON.stringify(config), err => {
                            if (!err) {
                                resolve()
                            } else {
                                reject(err)
                            }
                        })
                    }));

                    finished.push(new Promise((resolve, reject) => {
                        fs.mkdir(this.installPath.relativeToPath("instances"), (err: any) => {
                            if (!err) {
                                resolve()
                            } else {
                                reject(err)
                            }
                        })
                    }))
                } else {
                    reject(err)
                }
            })
        }))

        return Promise.all(finished)
    }

    checkInstallation(): Promise<boolean> {
        return new Promise<boolean>(resolve => {
            fs.access(this.installPath.toString(), (err: any) => {
                if (err) {
                    resolve(false)
                } else {
                    resolve(true)
                }
            })
        })
    }

    get installPath(): Path {
        if (process.platform === 'darwin') {
            return this.installationPaths.mac
        } else if (process.platform === 'win32') {
            return this.installationPaths.win
        }
    }

    get minecraftHomePath(): Path {
        if (process.platform === 'darwin') {
            return this.mineCraftHomePaths.mac
        } else if (process.platform === 'win32') {
            return this.mineCraftHomePaths.win
        }
    }

    getLastModPack(): Promise<any> {
        return new Promise(resolve => {
            this.launcherConfiguration
                .then((configuration: any) => {
                    const modPackConfig = configuration.modPacks[configuration.lastModPack];
                    resolve(modPackConfig)
                })
        })
    }

    getModPackConfigurationById(id: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.launcherConfiguration
                .then((configuration: any) => {
                    const modPackConfig = configuration.modPacks[id];
                    if (modPackConfig != null) {
                        resolve(configuration.modPacks[id])
                    } else {
                        reject()
                    }
                })
        })
    }

    get launcherConfiguration(): any {
        return new Promise((resolve, reject) => {
            fs.readFile(this.installPath.relativeToPath("launcher-config.json"), 'utf8', (err, data) => {
                if (!err) {
                    resolve(JSON.parse(data))
                } else {
                    reject(err)
                }
            })
        })
    }

    checkModPackInstallation(name: string): Promise<boolean> {
        return new Promise(resolve => {
            fs.access(this.installPath.relativeToPath(`instances/${name}`), (err: any) => {
                if (!err) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            })
        })

    }

    installMinecraftModPack(id: string, event: IpcMainEvent) {
        return new Promise<void>((resolve, reject) => {
            this.getModPackConfigurationById(id)
                .then(modPackConfig => {
                    wget.download(modPackConfig.installUrl, `${modPackConfig.mineCraftOpt.gameDir}.zip`)
                        .on('error', err => {
                            reject(err)
                        })
                        .on('progress', percentage => {
                            this.sendInstallPercentage(
                                Math.round(this.installPercentage + percentage * 100 * 0.48),
                                event
                            );
                        })
                        .on('end', () => {
                            this.addInstallPercentage(48, event)
                            zip.extract(`${modPackConfig.mineCraftOpt.gameDir}.zip`, `${modPackConfig.mineCraftOpt.gameDir}/..`)
                                .on('end', () => {
                                    this.addInstallPercentage(48, event)
                                    resolve()
                                })
                                .on('error', (error: any) => {
                                    reject(error)
                                })
                                .on('progress', (percentage:any) => {
                                    this.sendInstallPercentage(
                                        this.installPercentage + Math.round(percentage * 0.48),
                                        event
                                    );
                                })
                        })
                })
                .catch(console.log)
        })
    }

    writeConfigurationIntoMinecraftLauncher(modPackId: string, event: IpcMainEvent): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.getModPackConfigurationById(modPackId)
                .then(modPackConfig => {
                    const launcherProfilesPath = this.minecraftHomePath.relativeToPath('launcher_profiles.json')
                    fs.readFile(launcherProfilesPath, 'utf8', (err ,launcherProfiles) => {
                        if (err) {
                            reject(err)
                        } else {
                            const launcherProfilesObject = JSON.parse(launcherProfiles)

                            launcherProfilesObject.profiles[modPackConfig.id] = modPackConfig.mineCraftOpt

                            fs.writeFile(launcherProfilesPath, JSON.stringify(launcherProfilesObject), err => {
                                if (err) {
                                    reject(err)
                                } else {
                                    this.addInstallPercentage(
                                        2, event
                                    );

                                    resolve();
                                }
                            })
                        }
                    })
                })
                .catch(console.log)

        })
    }

    copyFilesIntoMinecraftHome(modPackId: string, event: IpcMainEvent): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.getModPackConfigurationById(modPackId)
                .then((config: any) => {
                    const finished = new Array<Promise<void>>();
                    const versionPath = `versions/${config.mineCraftOpt.lastVersionId}`

                    finished.push(this.copyVersionIntoMinecraftHome(modPackId, config, versionPath))
                    finished.push(this.copyVersionLibrariesIntoMinecraftHome(modPackId, config, versionPath))

                    Promise.all(finished)
                        .then(() => {
                            resolve()

                            this.addInstallPercentage(
                                2, event
                            );
                        })
                        .catch(reject)
                })
                .catch(reject)
        })

    }

    copyVersionLibrariesIntoMinecraftHome(modPackId: string, config: any, versionPath: string): Promise<void> {
        const versionNameFragments = config.mineCraftOpt.lastVersionId.split('-')
        const libraryName = `${versionNameFragments[0]}-${versionNameFragments[2]}`
        const libraryPath = `${versionPath}/lib/${libraryName}`

        return new Promise<void>((copyResolve, copyReject) => {
            fsExtra.copy(
                this.installPath.relativeToPath(`instances/${modPackId}/${libraryPath}`),
                this.minecraftHomePath.relativeToPath(`libraries/net/minecraftforge/forge/${libraryName}`),
                (err: any) => {
                    if (err) {
                        copyReject(err)
                    } else {
                        copyResolve()
                    }
                }
            )
        })
    }

    copyVersionIntoMinecraftHome(modPackId: string, config: any, versionPath: string): Promise<void> {
        return new Promise((copyResolve, copyReject) => {
            fsExtra.copy(
                this.installPath.relativeToPath(`instances/${modPackId}/${versionPath}`),
                this.minecraftHomePath.relativeToPath(`${versionPath}`),
                (err: any) => {
                    if (err) {
                        copyReject(err)
                    } else {
                        copyResolve(err)
                    }
                }
            )
        })
    }

    addInstallPercentage(percentage: number, event: IpcMainEvent) {
        this.installPercentage += percentage

        this.sendInstallPercentage(percentage, event)
    }

    sendInstallPercentage(percentage: number, event: IpcMainEvent) {

        const installationStatus: InstallationStatus = {
            stepPercentage: 0,
            percentage:  percentage,
            installationStep: 'installing',
            finished: false
        }

        event.sender.send('installationStatus', JSON.stringify(installationStatus))
    }

    openMinecraftLauncher(): Promise<void> {
        return new Promise(resolve => {
            console.log(this.startCommand)
            child_process.exec(this.startCommand)
            resolve()
        })
    }

    get startCommand(): string {
        if (process.platform === 'darwin') {
            return `open ${this.mineCraftLauncherPaths.mac}`
        } else if (process.platform === 'win32') {
            return `cd ${this.mineCraftLauncherPaths.win} && MinecraftLauncher.exe`
        } else {
            return 'OS not supported'
        }
    }

    folderExists(path: string): Promise<boolean> {
        return new Promise((resolve) => {
            fs.access(path, (err: any) => {
                if (!err) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            })
        })
    }

    download(url: string, to: string): Observable<number> {
        return new Observable<number>(subscriber => {
            wget.download(url, to)
                .on('progress', percentage => {
                    subscriber.next(Math.round(percentage * 100))
                })
                .on('end', () => {
                    subscriber.next(-1)
                })
                .on('error', err => {
                    subscriber.error(err)
                })
        })
    }
}
