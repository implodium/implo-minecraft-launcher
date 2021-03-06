import LauncherConfiguration from "../uitl/LauncherConfiguration";
import * as fs from "fs";
import {inject, injectable} from "inversify";
import FileController from "./FileController";
import {PathController} from "./PathController";
import {ModPackConfiguration} from "../uitl/ModPackConfiguration";
import MinecraftLauncherProfiles from "../uitl/MinecraftLauncherProfiles";

@injectable()
export class ConfigurationController {

    public defaultConfiguration: LauncherConfiguration = {
        modPacks: [
            {
                id: "low_on_time",
                name: '',
                logo: 'img/low_on_time_logo.png',
                installUrl: "https://github.com/implodium/minecraft-low-on-time/releases/download/1.0/low_on_time.zip",
                memory: 8,
                mineCraftOpt: {
                    created: "1970-01-01T00:00:00.000Z",
                    gameDir: this.pathController
                        .installPath
                        .path
                        .relativeToPath('instances/low_on_time'),
                    icon: "Furnace",
                    javaArgs: "-Xmx8G -XX:+UnlockExperimentalVMOptions -XX:+UseG1GC -XX:G1NewSizePercent=20 -XX:G1ReservePercent=20 -XX:MaxGCPauseMillis=50 -XX:G1HeapRegionSize=32M",
                    lastVersionId: "1.12.2-forge-14.23.5.2855",
                    name: "Low on Time",
                    type: "custom",
                    lastUsed: ""
                }
            }
        ],
        lastModPackID: "low_on_time"
    }

    constructor(
        @inject(FileController) private fileController: FileController,
        @inject(PathController) private pathController: PathController
    ) {

    }



    get configuration(): Promise<LauncherConfiguration> {
        const configurationPath = this.pathController
            .installPath
            .path
            .relativeToPath("launcher-config.json")

        return new Promise((resolve, reject) => {
            fs.readFile(configurationPath, 'utf8', (err: Error, data: any) => {
                if (!err) {
                    resolve(JSON.parse(data))
                } else {
                    reject(err)
                }
            })
        })
    }

    private updateConfiguration(config: LauncherConfiguration): Promise<void> {
        return new Promise((resolve, reject) => {
            const configurationPath = this.pathController
                .installPath
                .path
                .relativeToPath("launcher-config.json")

            fs.writeFile(configurationPath, JSON.stringify(config), (err: Error) => {
                if (!err) {
                    resolve()
                } else {
                    console.log()
                    reject(err)
                }
            })
        })
    }

    get minecraftLauncherConfiguration(): Promise<MinecraftLauncherProfiles> {
        const homeConfigurationPath = this.pathController
            .minecraftHomePath
            .path
            .relativeToPath("launcher_profiles.json")

        return new Promise((resolve, reject) => {
            fs.readFile(homeConfigurationPath, 'utf8', (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(JSON.parse(data))
                }
            })
        })
    }

    updateMcProfiles(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.configuration
                .then(config => {
                    this.minecraftLauncherConfiguration
                        .then(mcConfig => {
                            console.log(mcConfig)
                            this.getmodPackConfigBy(config.lastModPackID)
                                .then(modPackConfig => {
                                    mcConfig.profiles[config.lastModPackID]
                                        = modPackConfig.mineCraftOpt

                                    this.writeMinecraftLauncherConfiguration(mcConfig)
                                        .catch(reject)
                                        .then(resolve)
                                })
                        })
                        .catch(reject)
                })
                .catch(reject)
        })
    }

    writeMinecraftLauncherConfiguration(config: MinecraftLauncherProfiles): Promise<void> {
        return new Promise((resolve, reject) => {
            const configPath = this.pathController
                .minecraftHomePath
                .path
                .relativeToPath("launcher_profiles.json")

            fs.writeFile(configPath, JSON.stringify(config), err => {
                if (err) {
                    reject(err)
                } else {
                    resolve();
                }
            })
        })

    }

    getmodPackConfigBy(id: string): Promise<ModPackConfiguration> {
        return new Promise((resolve, reject) => {
            this.configuration
                .then(config => {
                    const modPackConfig = config.modPacks.filter(modPack => {
                        return modPack.id = id
                    })[0]

                    if (modPackConfig) {
                        resolve(modPackConfig)
                    } else {
                        reject('modPack not found')
                    }
                })
        })
    }

    setMemory(modPackId: string, newMemoryValue: number): Promise<MinecraftLauncherProfiles> {
        return new Promise((resolve, reject) => {
            this.configuration
                .then(config => {
                    const modPackConfig = config.modPacks.filter(modPack => {
                        return modPack.id === modPackId
                    })[0]

                    if (modPackConfig) {
                        modPackConfig.mineCraftOpt.javaArgs =
                            ConfigurationController.javaArgsWith(newMemoryValue)
                        modPackConfig.memory = newMemoryValue;

                        this.updateConfiguration(config)
                            .then(() => resolve(undefined))
                    } else {
                        reject('modPack not found')
                    }
                })
        })
    }

    getCurrentMemory(modPackId: string): Promise<number> {
        return new Promise((resolve, reject) => {
            this.getmodPackConfigBy(modPackId)
                .then(config => {
                    resolve(config.memory)
                })
                .catch(reject)
        })
    }

    private static javaArgsWith(memory: number) {
        return `-Xmx${memory}G -XX:+UnlockExperimentalVMOptions -XX:+UseG1GC -XX:G1NewSizePercent=20 -XX:G1ReservePercent=20 -XX:MaxGCPauseMillis=50 -XX:G1HeapRegionSize=32M`
    }
}
