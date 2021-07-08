import {Injectable, NgZone} from '@angular/core';
import {ElectronService} from "ngx-electron";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private electronService: ElectronService, private zone: NgZone) { }

  request(channel: string, listener: (...args: any[]) => void, ...args: any[]): void {
    this.send(channel, args);
    this.on(channel, listener)
  }

  requestProcess(channel: string, ...args: any[]): Observable<any> {
    return new Observable<any>(subscriber => {
      this.send(channel, args)

      this.on(`${channel}_next`, value => {
        subscriber.next(value)
      })

      this.on(`${channel}_complete`, () => {
        subscriber.complete()
      })

      this.on(`${channel}_error`, error => {
        subscriber.error(error)
      })
    })
  }

  on(channel: string, listener: (...args: any[]) => void): void {
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
