import { app, BrowserWindow } from 'electron';
import * as path from "path";
import * as url from "url";

let window;

function createWindow() {
  window = new BrowserWindow({
    width: 800,
    height: 600
  });

  window.loadURL(
    url.format({
      pathname: path.join(__dirname, '/dist/index.html'),
      protocol: 'file',
      slashes: true
    })
  );

  window.on('closed', () => window = null);
}

app.on('ready', createWindow);
app.on('window-all-closed', app.quit)
