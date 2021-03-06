import {Component, OnInit, Output, ViewChild} from '@angular/core';
import {WindowComponent} from "../window/window.component";
import {AppService} from "../services/app.service";
import ChangeMcMemoryRequest from "../../util/ChangeMcMemoryRequest";
import {EventEmitter} from "@angular/core";
import InstanceState from "../../util/InstanceState";
import {Router} from "@angular/router";


@Component({
  selector: 'app-settings-window',
  templateUrl: './settings-window.component.html',
  styleUrls: ['./settings-window.component.css']
})
export class SettingsWindowComponent implements OnInit {

  InstanceState = InstanceState

  @ViewChild(WindowComponent)
  window?: WindowComponent
  minMemory: number = 1;
  maxMemory: number = 8;
  memoryValue: number = 4
  modPackId?: string
  saveButtonText: string = "Save"
  instanceState?: InstanceState

  @Output()
  deleteInstance = new EventEmitter<void>();

  constructor(private app: AppService, private router: Router) { }

  ngOnInit(): void {
    this.app.request("getMaxMemory", (args: number) => {
      this.maxMemory = Math.round(args / 1073741824)
    })
  }

  private prepare() {
    this.getCurrentMemory()
  }

  open(modPackId?: string, instanceState?: InstanceState) {
    this.prepare()

    this.modPackId = modPackId
    this.instanceState = instanceState;

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
    if (this.modPackId) {
      this.app.request("deleteInstance", () => {
        this.deleteInstance.emit();
        this.close()
      }, this.modPackId)
    }
  }

  getCurrentMemory() {
    this.app.request("getCurrentMemory", memory => {
      this.memoryValue = memory
    }, this.modPackId)
  }

  updateButtonText() {
    this.saveButtonText = "Save"
  }

  deleteLauncherData() {
    this.app.request("delete-launcher-data", () => {
      this.router.navigate([""])
        .catch()
    })
  }

  isInstalled() {
    return this.instanceState === InstanceState.installed
  }

  openInstanceFolder() {
    this.app.request("open-instance-folder", () => null, this.modPackId)
  }
}
