import {inject, injectable} from "inversify";
import FileController from "./FileController";
import {PathController} from "./PathController";
import {ConfigurationController} from "./ConfigurationController";

@injectable()
export default class SetupController {

    constructor(
        @inject(FileController) public fileController: FileController,
        @inject(PathController) public pathController: PathController,
        @inject(ConfigurationController) public configController: ConfigurationController
    ) {
    }

    isBaseInstalled(): Promise<boolean> {
        const baseInstallLocation = this.pathController.installPath.path
        return this.fileController.folderExists(baseInstallLocation.toString())
    }

    get basePath(): string {
        return this.pathController
            .installPath
            .path
            .toString()
    }

    installBase(): Promise<void> {
        return new Promise((resolve, reject) => {
            return this.fileController
                .installBase(this.configController.defaultConfiguration)
                .then(() => resolve(null))
                .catch(reject)
        })
    }
}
