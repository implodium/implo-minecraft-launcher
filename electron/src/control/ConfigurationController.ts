import LauncherConfiguration from "../uitl/LauncherConfiguration";
import * as fs from "fs";
import {inject, injectable} from "inversify";
import FileController from "./FileController";
import {PathController} from "./PathController";
import {ModPackConfiguration} from "../uitl/ModPackConfiguration";
import MinecraftLauncherProfiles from "../uitl/MinecraftLauncherProfiles";

@injectable()
export class ConfigurationController {

    private loadedConfiguration?: Promise<any>
    private loadedMinecraftLauncherConfiguration?: Promise<any>

    public defaultConfiguration: LauncherConfiguration = {
        modPacks: [
            {
                id: "summer2021",
                name: 'Summer 2021',
                logo: 'img/summer2021.jpg',
                installUrl: "https://github.com/QuirinEcker/summer2021/releases/download/1.5/summer2021.zip",
                mineCraftOpt: {
                    created: "1970-01-01T00:00:00.000Z",
                    gameDir: this.pathController
                        .installPath
                        .path
                        .relativeToPath('instances/summer2021'),
                    icon: "Furnace",
                    javaArgs: "-Xmx8G -XX:+UnlockExperimentalVMOptions -XX:+UseG1GC -XX:G1NewSizePercent=20 -XX:G1ReservePercent=20 -XX:MaxGCPauseMillis=50 -XX:G1HeapRegionSize=32M",
                    lastVersionId: "1.12.2-forge-14.23.5.2855",
                    name: "summer2021",
                    type: "custom",
                    lastUsed: ""
                }
            }
        ],
        lastModPackID: "summer2021"
    }

    constructor(
        @inject(FileController) private fileController: FileController,
        @inject(PathController) private pathController: PathController
    ) {

    }



    get configuration(): Promise<LauncherConfiguration> {
        if (this.loadedConfiguration) {
            return this.loadedConfiguration
        } else {
            const configurationPath = this.pathController
                .installPath
                .path
                .relativeToPath("launcher-config.json")

            this.loadedConfiguration = new Promise((resolve, reject) => {
                fs.readFile(configurationPath, 'utf8', (err: Error, data: any) => {
                    if (!err) {
                        resolve(JSON.parse(data))
                    } else {
                        reject(err)
                    }
                })
            })

            return this.loadedConfiguration
        }
    }

    get minecraftLauncherConfiguration(): Promise<MinecraftLauncherProfiles> {
        if (this.loadedMinecraftLauncherConfiguration) {
            return this.loadedMinecraftLauncherConfiguration
        } else {
            const homeConfigurationPath = this.pathController
                .minecraftHomePath
                .path
                .relativeToPath("launcher_profiles.json")

            this.loadedMinecraftLauncherConfiguration = new Promise((resolve, reject) => {
                fs.readFile(homeConfigurationPath, 'utf8', (err, data) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(JSON.parse(data))
                    }
                })
            })

            return this.loadedMinecraftLauncherConfiguration
        }
    }

    writeMinecraftLauncherConfiguration(config: MinecraftLauncherProfiles): Promise<void> {
        this.loadedMinecraftLauncherConfiguration = new Promise(resolve => {
            resolve(config)
        })

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

}
