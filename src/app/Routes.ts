import {Routes} from "@angular/router";
import {MainComponent} from "./components/main/main.component";

const routes: Routes = [
  {path: '', component: MainComponent},
  {path: 'login', component: LoginComponent}
]

export default routes;
