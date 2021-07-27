import 'reflect-metadata'
import { Container } from "inversify";
import FileController from "../control/FileController";
import ElectronController from "../control/ElectronController";
import SetupController from "../control/SetupController";
import {PathController} from "../control/PathController";
import ModPackController from "../control/ModPackController";
import {ConfigurationController} from "../control/ConfigurationController";

const CDIContainer = new Container()

CDIContainer.bind(FileController).toSelf()
CDIContainer.bind(ElectronController).toSelf()
CDIContainer.bind(SetupController).toSelf()
CDIContainer.bind(PathController).toSelf()
CDIContainer.bind(ModPackController).toSelf()
CDIContainer.bind(ConfigurationController).toSelf()

export default CDIContainer
