import * as os from "os";
import Path from "../uitl/Path";
import * as fs from "fs";
import * as wget from 'wget-improved'
const fsExtra = require('fs-extra')
const zip = require('onezip')

export default class FileController {
    private readonly installationPaths = {
        mac: new Path(`/Users/${os.userInfo().username}/Library/ApplicationSupport/.implo-launcher/`),
        win: new Path(`C:\\Users\\${os.userInfo().username}\\AppData\\Roaming\\.implo-launcher\\`)
    }

    private readonly mineCraftHomePaths = {
        mac: new Path(`/Users/${os.userInfo().username}/Library/ApplicationSupport/minecraft/`),
        win: new Path(`C:\\Users\\${os.userInfo().username}\\AppData\\Roaming\\.minecraft\\`)
    }

    installBase(): Promise<void[]> {
        let finished: Array<Promise<void>> = []
        finished.push(new Promise((resolve, reject) => {
            fs.mkdir(this.installPath.toString(), (err: any) => {
                if (!err) {
                    resolve()
                    finished.push(new Promise((resolve, reject) => {
                        fs.writeFile(this.installPath.relativeToPath('launcher-config.json'), JSON.stringify({
                            modPacks: {
                                summer2021: {
                                    id: "summer2021",
                                    name: 'Summer 2021',
                                    logo: 'img/summer2021.jpg',
                                    installUrl: "https://github.com/QuirinEcker/summer2021/releases/download/1.5/summer2021.zip",
                                    mineCraftOpt: {
                                        created: "1970-01-01T00:00:00.000Z",
                                        gameDir: this.installPath.relativeToPath('instances/summer2021'),
                                        icon: "Furnace",
                                        javaArgs: "-Xmx8G -XX:+UnlockExperimentalVMOptions -XX:+UseG1GC -XX:G1NewSizePercent=20 -XX:G1ReservePercent=20 -XX:MaxGCPauseMillis=50 -XX:G1HeapRegionSize=32M",
                                        lastVersionId: "1.12.2-forge-14.23.5.2855",
                                        name: "summer2021",
                                        type: "custom"
                                    }
                                }
                            },
                            lastModPack: "summer2021"
                        }), err => {
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

    installMinecraftModPack(id: string) {
        this.getModPackConfigurationById(id)
            .then(modPackConfig => {
                wget.download(modPackConfig.installUrl, `${modPackConfig.mineCraftOpt.gameDir}.zip`)
                    .on('error', err => {
                        console.log(err)
                    })
                    .on('progress', percentage => {
                        console.log(percentage * 100)
                    })
                    .on('end', () => {
                        zip.extract(`${modPackConfig.mineCraftOpt.gameDir}.zip`, `${modPackConfig.mineCraftOpt.gameDir}/..`)
                            .on('end', () => {
                                console.log('finished extracting')
                                this.copyVersionIntoMinecraftHome(id)
                            })
                            .on('error', (error: any) => {
                                console.error(error);
                            })
                            .on('progress', (percentage:any) => {
                                console.log(percentage * 100)
                            })
                    })
            })
            .catch(console.log)
    }

    writeConfigurationIntoMinecraftLauncher(modPackId: string) {
        this.getModPackConfigurationById(modPackId)
            .then(modPackConfig => {
                const launcherProfilesPath = this.minecraftHomePath.relativeToPath('launcher_profiles.json')
                fs.readFile(launcherProfilesPath, 'utf8', (err ,launcherProfiles) => {
                    const launcherProfilesObject = JSON.parse(launcherProfiles)

                    launcherProfilesObject.profiles[modPackConfig.id] = modPackConfig.mineCraftOpt

                    fs.writeFile(launcherProfilesPath, JSON.stringify(launcherProfilesObject), err => {
                        console.log(err)
                        console.log("wrote config into minecraft launcher config")
                    })
                })
            })
            .catch(console.log)

    }

    copyVersionIntoMinecraftHome(modPackId: string) {

        this.getModPackConfigurationById(modPackId)
            .then((config: any) => {
                const versionPath = `versions/${config.mineCraftOpt.lastVersionId}`

                fsExtra.copy(
                    this.installPath.relativeToPath(`instances/${modPackId}/${versionPath}`),
                    this.minecraftHomePath.relativeToPath(`${versionPath}`),
                    (err: any) => {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log("copied version")
                        }
                    }
                )

                // 1.12.2-forge-14.23.5.2855
                const versionNameFragments = config.mineCraftOpt.lastVersionId.split('-')
                const libraryName = `${versionNameFragments[0]}-${versionNameFragments[2]}`
                console.log(libraryName)
                const libraryPath = `${versionPath}/lib/${libraryName}`

                fsExtra.copy(
                    this.installPath.relativeToPath(`instances/${modPackId}/${libraryPath}`),
                    this.minecraftHomePath.relativeToPath(`libraries/net/minecraftforge/forge/${libraryName}`),
                    (err: any) => {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log("copied library")
                        }
                    }
                )

            })
            .catch(console.log)
    }
}
