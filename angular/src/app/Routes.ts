import {Routes} from "@angular/router";
import {MainComponent} from "./components/main/main.component";
import {SetupComponent} from "./components/setup/setup.component";
import {HomeComponent} from "./components/home/home.component";

const routes: Routes = [
  {path: '', component: MainComponent},
  {path: 'setup', component: SetupComponent},
  {path: 'home', component: HomeComponent}
]

export default routes;
