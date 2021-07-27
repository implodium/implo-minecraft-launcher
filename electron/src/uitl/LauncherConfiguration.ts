import {ModPackConfiguration} from "./ModPackConfiguration";

export default interface LauncherConfiguration {
    modPacks: Array<ModPackConfiguration>
    lastModPackID: string
}
