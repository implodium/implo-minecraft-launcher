import {Routes} from "@angular/router";
import {MainComponent} from "./components/main/main.component";
import {LoginComponent} from "./components/login/login.component";
import {SetupComponent} from "./components/setup/setup.component";

const routes: Routes = [
  {path: '', component: MainComponent},
  {path: 'setup', component: SetupComponent},
  {path: 'login', component: LoginComponent}
]

export default routes;
