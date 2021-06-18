import {app} from 'electron'
import App from "./App";

app.on('ready', () => {
    const electronApp = new App()
    electronApp.init()
})
