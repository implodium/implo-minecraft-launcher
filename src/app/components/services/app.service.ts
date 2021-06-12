import {Injectable, NgZone} from '@angular/core';
import {ElectronService} from "ngx-electron";
import {IpcRendererEvent} from "electron";

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private electronService: ElectronService, private zone: NgZone) { }

  request(channel: string, listener: (...args: any[]) => void, ...args: any[]): void {
    this.send(channel, args);
    this.on(channel, listener)
  }

  on(channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void): void {
    if (this.electronService) {
        this.electronService.ipcRenderer.on(channel, ((event, args) => {
          this.zone.run(() => {
            listener(args)
          })
        }))
    }
  }

  send(channel: string, ...args: any[]) {
    this.electronService.ipcRenderer.send(channel, args)
  }
}
