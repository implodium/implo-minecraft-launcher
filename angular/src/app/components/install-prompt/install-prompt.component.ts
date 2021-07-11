import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import InstallationStatus from "../../util/InstallationStatus";
import {AppService} from "../services/app.service";

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
  active: boolean = true

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
    console.log(this.modPackId)
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
  }

  close() {
    this.active = false
    this.pageNo = 1
    this.modPackId = undefined
  }

  open(id: string) {
    this.modPackId = id
    this.active = true
  }

  sliderFormat(value: number) {
    return value + "gb"
  }

}
