import {Routes} from '@angular/router';
import {Connect4Component} from "./components/connect4/connect4.component";
import {ProjectsComponent} from "./components/projects/projects.component";
import {ProjectInfoComponent} from "./components/projects/project-info/project-info.component";
import {CatanComponent} from "./components/catan/catan.component";
import {CatanGameSettingsComponent} from "./components/catan/game-settings/game-settings.component";

export const routes: Routes = [
    {path: '', redirectTo: 'projects', pathMatch: 'full'},
    {path: 'projects', component: ProjectsComponent},
    {path: 'projects/:name/info', component: ProjectInfoComponent},
    {path: 'projects/connect4', component: Connect4Component},
    {path: 'projects/catan', component: CatanGameSettingsComponent},
    {path: 'projects/catan/game', component: CatanComponent}
];
