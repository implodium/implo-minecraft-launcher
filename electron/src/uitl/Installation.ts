import {Observable, Subject} from "rxjs";
import InstallationStatus from "./InstallationStatus";
import {ModPackConfiguration} from "./ModPackConfiguration";

export default class Installation {

    private _update: Subject<InstallationStatus> = new Subject<InstallationStatus>()
    public _config?: ModPackConfiguration;

    private status: InstallationStatus = {
        finished: false,
        stepPercentage: 0,
        percentage: 0,
        installationStep: 'installing'
    }

    constructor(public readonly id: string) {
    }

    set config(config: ModPackConfiguration) {
        this._config = config
    }

    getConfiguration(): Promise<ModPackConfiguration> {
        return new Promise((resolve, reject) => {
            if (this._config) {
                resolve(this._config)
            } else {
                reject('config not found')
            }
        })
    }

    set percentage(percentage: number) {
        this.status.percentage = this.status.stepPercentage + percentage
        this.notify()
    }

    set stepPercentage(percentage: number) {
        this.status.stepPercentage = percentage
        this.notify()
    }

    set installationStep(step: string) {
        this.status.installationStep = step
        this.notify()
    }

    finish() {
        this.status.finished = true;
        this.percentage = 0
        this.stepPercentage = 100
        this.installationStep = 'finished'
        this.notify()
        this.complete()
    }

    notify() {
        this._update.next(this.status)
    }

    complete() {
        this._update.complete()
    }

    get stream(): Observable<InstallationStatus> {
        return this._update
    }
}
