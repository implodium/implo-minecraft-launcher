import {ModPackConfiguration} from "../uitl/ModPackConfiguration";
import {inject, injectable} from "inversify";
import FileController from "./FileController";
import {ConfigurationController} from "./ConfigurationController";
import {PathController} from "./PathController";
import Installation from "../uitl/Installation";
import {Observable} from "rxjs";
import InstallationStatus from "../uitl/InstallationStatus";
import MinecraftLauncherProfiles from "../uitl/MinecraftLauncherProfiles";

@injectable()
export default class ModPackController {

    constructor(
        @inject(FileController) private fileController: FileController,
        @inject(ConfigurationController) private configController: ConfigurationController,
        @inject(PathController) private pathController: PathController
    ) {
    }

    install(id: string): Observable<InstallationStatus> {
        const installation = new Installation(id)

        this.initiateConfig(installation)
            .then(installation => this.download(installation))
            .then(installation => this.extract(installation))
            .then(installation => this.copying(installation))
            .then(installation => this.finish(installation))
            .catch(console.log)

        return installation.stream
    }

    isInstalled(id: string): Promise<boolean> {
        const installPath = this.pathController.installPath
            .path
            .relativeToPath(`instances/${id}`)

        return this.fileController.folderExists(installPath)
    }

    get lastModPack(): Promise<ModPackConfiguration> {
        return new Promise((resolve, reject) => {
            this.configController.configuration
                .then(config => {
                    const modPackConfig = config.modPacks.filter(
                        modPack => modPack.id === config.lastModPackID
                    )[0]

                    if (modPackConfig) {
                        resolve(modPackConfig)
                    } else {
                        reject(
                            "Something went wrong last modPack does not exist"
                        )
                    }
                })
                .catch(reject)
        })
    }

    private initiateConfig(installation: Installation): Promise<Installation> {
        return new Promise((resolve, reject) => {
            this.configController.getmodPackConfigBy(installation.id)
                .then(config => {
                    installation.config = config
                    resolve(installation)
                })
                .catch(reject)
        })
    }

    private download(installation: Installation): Promise<Installation> {
        return new Promise((resolve, reject) => {
            installation.getConfiguration()
                .then(config => {
                    installation.installationStep = 'downloading'
                    this.fileController.download(
                        config.installUrl,
                        `${config.mineCraftOpt.gameDir}.zip`
                    ).subscribe({
                        error(error) {
                            reject(error)
                        },
                        next(percentage) {
                            installation.percentage = Math.round(percentage * 0.48)
                        },
                        complete() {
                            installation.stepPercentage = 48
                            resolve(installation)
                        }
                    })
                })
                .catch(reject)
        })
    }

    private extract(installation: Installation): Promise<Installation> {
        return new Promise((resolve, reject) => {
            installation.getConfiguration()
                .then(config => {
                    installation.installationStep = 'extracting'
                    this.fileController.extract(
                        `${config.mineCraftOpt.gameDir}.zip`,
                        `${config.mineCraftOpt.gameDir}/..`
                    ).subscribe({
                        error(error) {
                            reject(error)
                        },
                        next(percentage) {
                            installation.percentage = Math.round(percentage * 0.48)
                        },
                        complete() {
                            installation.stepPercentage = 96
                            resolve(installation)
                        },
                    })
                })
                .catch(reject)
        })
    }

    private copying(installation: Installation): Promise<Installation> {
        return new Promise((resolve, reject) => {
            installation.getConfiguration()
                .then(config => {
                    installation.installationStep = 'copying'
                    const finish: Array<Promise<void>> = []

                    finish.push(this.writeConfiguration(config))
                    finish.push(this.copyVersions(config))
                    finish.push(this.copyVersionLib(config))

                    Promise.all(finish)
                        .then(() => {
                            installation.stepPercentage = 100
                            installation.percentage = 0
                            resolve(installation)
                        })
                        .catch(reject)
                })
        })
    }

    private writeConfiguration(config: ModPackConfiguration): Promise<void> {
        return this.configController.minecraftLauncherConfiguration
            .then(mcConfig => ModPackController.insertDefaultConfig(mcConfig, config))
            .then(mcConfig => {
                return this.configController
                    .writeMinecraftLauncherConfiguration(mcConfig)
            })
    }

    private static insertDefaultConfig(mcConfig: MinecraftLauncherProfiles, config: ModPackConfiguration): MinecraftLauncherProfiles {
        mcConfig.profiles[config.id] = config.mineCraftOpt
        return mcConfig;
    }

    private finish(installation: Installation): Promise<Installation> {
        return new Promise((resolve) => {
            installation.finish()
            resolve(installation)
        })
    }

    private copyVersions(config: ModPackConfiguration): Promise<void> {
        console.log("finished writign config now copying version files")
        const from = this.pathController
            .installPath
            .path
            .relativeToPath(
                `instances/${config.id}/versions/${config.mineCraftOpt.lastVersionId}`
            );

        const to = this.pathController
            .minecraftHomePath
            .path
            .relativeToPath(`versions/${config.mineCraftOpt.lastVersionId}`)

        return this.fileController.copy(from, to)
    }

    private copyVersionLib(config: ModPackConfiguration): Promise<void> {
        const versionNameFragments = config.mineCraftOpt.lastVersionId.split('-')
        const libraryName = `${versionNameFragments[0]}-${versionNameFragments[2]}`
        const libraryHomePath = `versions/${config.mineCraftOpt.lastVersionId}/lib/${libraryName}`

        const from = this.pathController
            .installPath
            .path
            .relativeToPath(`instances/${config.id}/${libraryHomePath}`)

        const to = this.pathController
            .minecraftHomePath
            .path
            .relativeToPath(`libraries/net/minecraftforge/forge/${libraryName}`)

        return this.fileController.copy(from, to)
    }

    deleteBy(id: string): Promise<void> {
        return this.fileController.deleteFolder(
            this.pathController
                .installPath
                .path
                .relativeToPath(`instances/${id}`)
        )
    }

    openInstanceFolder(modPackId: string) {
        this.fileController.openFolder(
            this.pathController
                .installPath
                .path
                .relativeToPath(`instances/${modPackId}`)
        )
    }
}

