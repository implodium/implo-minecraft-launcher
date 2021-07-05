export interface ModPackConfiguration {
    id: string;
    name: string;
    logo: string;
    installUrl: string;
    mineCraftOpt: {
        created: string;
        gameDir: string;
        icon: string;
        javaArgs: string;
        lastVersionId: string;
        name: string;
        type: string
    }
}
