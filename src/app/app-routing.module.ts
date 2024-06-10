import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LayoutComponent} from './layouts/layout.component';
import {FULL_ROUTES} from "./shared/routes/full-layouts.route";
import {CONTENT_ROUTES} from "./shared/routes/content-layouts.route";
import {AuthGuard} from "./shared/guards/auth.guard";
import {RoleGuard} from "./shared/guards/role.guard";


const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: '', children: CONTENT_ROUTES},
    {path: '', component: LayoutComponent, children: FULL_ROUTES, canActivate: [AuthGuard, RoleGuard]}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
