import ProfileConfiguration from "./ProfileConfiguration";

export interface ModPackConfiguration {
    id: string;
    name: string;
    logo: string;
    installUrl: string;
    memory: number;
    mineCraftOpt: ProfileConfiguration;
}
