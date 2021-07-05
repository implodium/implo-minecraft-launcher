import { Container } from "inversify";
import FileController from "../control/FileController";
import ElectronController from "../control/ElectronController";
import 'reflect-metadata'

const CDIContainer = new Container()

CDIContainer.bind(FileController).toSelf()
CDIContainer.bind(ElectronController).toSelf()

export default CDIContainer
