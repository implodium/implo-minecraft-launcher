import {app, BrowserWindow} from "electron";
import * as url from "url";
import * as path from "path";

export default class ElectronController {

    private _window: BrowserWindow;

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

        if (!app.isPackaged) {
            this._window.webContents.openDevTools()
        }

        this._window.loadURL(
            url.format({
                pathname: path.join(__dirname, '../../../angular/index.html'),
                protocol: 'file',
                slashes: true
            })
        );

        this._window.on('closed', () => {
            window = null
        });

        return this._window
    }

}
