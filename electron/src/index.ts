import 'reflect-metadata'
import {app} from 'electron'
import App from "./App";
import CDIContainer from "./container/CDIContainer";

app.on('ready', () => {
    const app = CDIContainer.resolve(App)
    app.init()
})
