import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from "path";
import * as url from "url";
import * as fs from 'fs';
import * as os from 'os'

let window;
const macosPath = `/Users/${os.userInfo().username}/Library/ApplicationSupport/.implo-launcher`
const winPath = `C:\\Users\\${os.userInfo().username}\\AppData\\Roaming\\.implo-launcher`

function createWindow() {
  window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  window.webContents.openDevTools()

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

ipcMain.on('checkInstallation', event => {
  if (process.platform === 'darwin') {
    fs.access(macosPath, (err) => {
      if (err) {
        event.sender.send('checkInstallation', false);
      } else {
        event.sender.send('checkInstallation', true);
      }
    });
  } else if (process.platform === 'win32') {
    fs.access(winPath, (err) => {
      if (err) {
        event.sender.send('checkInstallation', false);
      } else  {
        event.sender.send('checkInstallation', true);
      }
    })
  }
})

ipcMain.on('quit', () => {
  app.quit();
})

ipcMain.on('getPath', event => {
  if (process.platform === 'darwin') {
    event.sender.send('getPath', macosPath)
  } else if (process.platform === "win32") {
    event.sender.send('getPath', winPath)
  }
})

ipcMain.on('installBase', event => {
  if (process.platform === 'darwin') {
    fs.mkdir(macosPath, err => {
      if (!err) {
        let filesCreated: Array<Promise<void>> = [];

        filesCreated.push(new Promise((resolve, reject) =>  {
          fs.writeFile(macosPath + "/auth.json", JSON.stringify({loggedIn: false}), err => {
            if (!err) {
              resolve()
            } else {
              reject(err)
            }
          })
        }));

        filesCreated.push(new Promise((resolve, reject) => {
          fs.mkdir(macosPath + "/instances", err => {
            if (!err) {
              resolve()
            } else {
              reject(err)
            }
          })
        }))

        Promise.all(filesCreated)
          .then(() => {
            event.sender.send('installBase')
          })
          .catch(console.log)
      }
    })
  } else if (process.platform === 'win32') {
    fs.mkdir(winPath, err => {
      if (!err) {
        let filesCreated: Array<Promise<void>> = [];

        filesCreated.push(new Promise((resolve, reject) =>  {
          fs.writeFile(winPath + "\\auth.json", JSON.stringify({loggedIn: false}), err => {
            if (!err) {
              resolve()
            } else {
              reject(err)
            }
          })
        }));

        filesCreated.push(new Promise((resolve, reject) => {
          fs.mkdir(winPath + "\\instances", err => {
            if (!err) {
              resolve()
            } else {
              reject(err)
            }
          })
        }))

        Promise.all(filesCreated)
          .then(() => {
            event.sender.send('installBase')
          })
          .catch(console.log)
      }
    })
  }
})
