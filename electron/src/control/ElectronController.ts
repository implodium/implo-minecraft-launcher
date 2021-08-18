import {app, BrowserWindow} from "electron";
import * as url from "url";
import * as path from "path";
import {injectable} from "inversify";

@injectable()
export default class ElectronController {

    private _window: BrowserWindow;
    private baseUrl: string;

    constructor() {
        this.baseUrl = url.format({
            pathname: path.join(__dirname, '../angular/index.html'),
            protocol: 'file',
            slashes: true
        })
    }


    get window(): BrowserWindow {
        return this._window
    }

    createWindow(): BrowserWindow {
        this._window = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false
            }
        });

        this._window.removeMenu()

        if (!app.isPackaged) {
            this._window.webContents.openDevTools()
        }

        this._window.loadURL(this.baseUrl);

        this._window.on('closed', () => {
            app.quit()
        });

        this._window.webContents.on('did-fail-load', () => {
            this._window.loadURL(this.baseUrl)
        })

        return this._window
    }

}
