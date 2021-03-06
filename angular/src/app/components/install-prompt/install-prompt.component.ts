import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import InstallationStatus from "../../util/InstallationStatus";
import {AppService} from "../services/app.service";
import ChangeMcMemoryRequest from "../../util/ChangeMcMemoryRequest";

@Component({
  selector: 'app-install-prompt',
  templateUrl: './install-prompt.component.html',
  styleUrls: ['./install-prompt.component.css']
})
export class InstallPromptComponent implements OnInit {

  modPackId?: string
  pageNo: number = 1
  pageMax: number = 3
  finished: boolean = false
  installStatus?: InstallationStatus
  active: boolean = false

  @Output("installFinished")
  installFinished = new EventEmitter<void>()
  memory: number = 8
  maxMemory?: number
  minMemory: number = 1
  memoryValue: number = 7

  constructor(private app: AppService) { }

  ngOnInit(): void {
    this.app.request("getMaxMemory", (args: number) => {
      this.maxMemory = Math.round(args / 1073741824)
      this.memoryValue = this.maxMemory / 2
    })
  }

  previous() {
    this.pageNo--
  }

  next() {
    this.pageNo++
  }

  finish() {
    this.close()
  }

  install() {
    this.next()
    this.updateMemory()
      .then(() => {
        if (this.modPackId) {
          this.app.requestProcess('installMinecraftModPack', this.modPackId)
            .subscribe({
              next: (status) => {
                this.installStatus = status
              },
              complete: () => {
                this.finished = true
                this.installFinished.emit()
              }
            })
        }
     });
  }

  updateMemory(): Promise<void> {
    return new Promise(resolve => {
      if (this.modPackId) {
        const changeMemoryRequest: ChangeMcMemoryRequest = {
          newMemoryValue: this.memoryValue,
          modPackId: this.modPackId
        }

        this.app.request("changeMemory", () => {
          resolve()
        }, JSON.stringify(changeMemoryRequest));
      }
    })
  }


  close() {
    this.cancel()
    this.reset()
    this.active = false
  }

  reset() {
    this.resetWindow()
    this.resetPage()
    this.resetInstallation()
  }

  resetWindow() {
    this.modPackId = undefined
  }

  resetPage() {
    this.pageNo = 1
  }

  resetInstallation() {
    this.installStatus = undefined
    this.finished = false

  }

  open(id: string) {
    this.pageNo = 1
    this.modPackId = id
    this.active = true
  }

  sliderFormat(value: number) {
    return value + "gb"
  }

  cancel() {
    this.app.request("cancel-instance-installation", () => {
      this.resetInstallation()
      this.previous()
    })
  }
}
