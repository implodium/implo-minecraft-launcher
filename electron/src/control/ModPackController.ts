import {ModPackConfiguration} from "../uitl/ModPackConfiguration";
import {inject, injectable} from "inversify";
import FileController from "./FileController";
import {ConfigurationController} from "./ConfigurationController";
import {PathController} from "./PathController";
import Installation from "../uitl/Installation";
import {Observable} from "rxjs";
import InstallationStatus from "../uitl/InstallationStatus";

@injectable()
export default class ModPackController {

    private installations: Array<Installation> = []

    constructor(
        @inject(FileController) private fileController: FileController,
        @inject(ConfigurationController) private configController: ConfigurationController,
        @inject(PathController) private pathController: PathController
    ) { }

    install(id: string): Observable<InstallationStatus> {
        const installation = new Installation(id)
        this.installations.push(installation)

        this.initiateConfig(installation)
            .then(installation => this.download(installation))
            .then(installation => this.extract(installation))
            .then(installation => this.copyFiles(installation))
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
                        error(error) { reject(error) },
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
                        config.mineCraftOpt.gameDir
                    ).subscribe({
                        error(error) { reject(error) },
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

    private copyFiles(installation: Installation): Promise<Installation> {
        return new Promise((resolve, reject) => {
            console.log("copying files")
        })
    }
}
