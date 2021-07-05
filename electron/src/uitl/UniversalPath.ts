import Path from "./Path";

export default class UniversalPath {

    public readonly winPath: Path
    public readonly macPath: Path

    constructor(
        winPath: string,
        macPath: string
    ) {
        this.winPath = new Path(winPath)
        this.macPath = new Path(macPath)
    }

    get path() {
        if (process.platform === 'darwin') {
            return this.macPath
        } else if (process.platform === 'win32') {
            return this.winPath
        } else {
            throw new Error('OS not supported')
        }
    }

}
