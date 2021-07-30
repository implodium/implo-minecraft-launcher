import {Component, OnInit, ViewChild} from '@angular/core';
import {WindowComponent} from "../window/window.component";
import {AppService} from "../services/app.service";
import ChangeMcMemoryRequest from "../../util/ChangeMcMemoryRequest";

@Component({
  selector: 'app-settings-window',
  templateUrl: './settings-window.component.html',
  styleUrls: ['./settings-window.component.css']
})
export class SettingsWindowComponent implements OnInit {

  @ViewChild(WindowComponent)
  window?: WindowComponent
  minMemory: number = 1;
  maxMemory: number = 8;
  memoryValue: number = 4
  modPackId?: string
  saveButtonText: string = "Save"

  constructor(private app: AppService) { }

  ngOnInit(): void {
    this.app.request("getMaxMemory", (args: number) => {
      this.maxMemory = Math.round(args / 1073741824)
      this.memoryValue = this.maxMemory / 2
    })
  }

  open(modPackId: string) {
    this.modPackId = modPackId
    if (this.window) {
      this.window.open()
    }
  }

  close() {
    if (this.window) {
      this.window.close()
    }
  }


  saveMemory() {
    if (this.modPackId) {
      const memoryRequest: ChangeMcMemoryRequest = {
        newMemoryValue: this.memoryValue,
        modPackId: this.modPackId,
      }

      this.app.request("changeMemory", () => {
        this.saveButtonText = "saved"
      }, JSON.stringify(memoryRequest));
    }
  }

  deleteInstallation() {

  }

  updateButtonText() {
    this.saveButtonText = "Save"
  }
}