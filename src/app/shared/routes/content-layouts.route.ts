import {Routes} from "@angular/router";

export const CONTENT_ROUTES: Routes = [
    {
        path: '',
        loadChildren: () => import('../../pages/pages.module').then(m => m.PagesModule)
    }
];