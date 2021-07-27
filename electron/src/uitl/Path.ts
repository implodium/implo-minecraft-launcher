export default class Path {
    private _path: string;

    constructor(path: string) {
        this._path = path
    }

    public relativeToPath(path: string) {
        if (process.platform === 'darwin') {
            return this._path + path;
        } else if (process.platform === 'win32') {
            return this._path + path.replace("/", "\\")
        } else  {
            throw new Error("OS not supported")
        }
    }

    public toString(): string {
        return this._path
    }
}
