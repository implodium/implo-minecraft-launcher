import ProfileConfiguration from "./ProfileConfiguration";

export default interface MinecraftLauncherProfiles {
    clientToken: string
    launcherVersion: {
        format: number
        name: string
        profilesFormat: number
    }
    profiles: Record<string, ProfileConfiguration>
    settings: {
        crashAssistance: boolean,
        enableAdvanced: boolean,
        enableAnalytics: boolean,
        enableHistorical: boolean,
        enableReleases: boolean,
        enableSnapshots: boolean,
        keepLauncherOpen: boolean,
        profileSorting: string,
        showGameLog: boolean,
        showMenu: boolean,
        soundOn: boolean
    }
}
