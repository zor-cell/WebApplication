import {Routes} from '@angular/router';
import {Connect4Component} from "./components/connect4/connect4.component";
import {ProjectsComponent} from "./components/projects/projects.component";

export const routes: Routes = [
    {path: 'projects', component: ProjectsComponent},
    {path: 'connect4', component: Connect4Component}
];
