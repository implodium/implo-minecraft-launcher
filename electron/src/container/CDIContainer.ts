import { Container } from "inversify";
import FileController from "../control/FileController";
import ElectronController from "../control/ElectronController";
import 'reflect-metadata'
import SetupController from "../control/SetupController";
import {PathController} from "../control/PathController";

const CDIContainer = new Container()

CDIContainer.bind(FileController).toSelf()
CDIContainer.bind(ElectronController).toSelf()
CDIContainer.bind(SetupController).toSelf()
CDIContainer.bind(PathController).toSelf()

export default CDIContainer
