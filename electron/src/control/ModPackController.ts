import {ModPackConfiguration} from "../uitl/ModPackConfiguration";
import {inject, injectable} from "inversify";
import FileController from "./FileController";
import {ConfigurationController} from "./ConfigurationController";
import {PathController} from "./PathController";

@injectable()
export default class ModPackController {

    constructor(
        @inject(FileController) private fileController: FileController,
        @inject(ConfigurationController) private configController: ConfigurationController,
        @inject(PathController) private pathController: PathController
    ) { }

    install(id: string) {
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
}
