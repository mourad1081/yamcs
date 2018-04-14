import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundPage } from './core/pages/NotFoundPage';
import { HomePage } from './core/pages/HomePage';
import { ProfilePage } from './core/pages/ProfilePage';
import { AuthGuard } from './core/guards/AuthGuard';
import { LoginPage } from './core/pages/LoginPage';
import { ForbiddenPage } from './core/pages/ForbiddenPage';

/*
 * Notes that the nested modules also have AuthGuards.
 * These will fully execute before other guards in those modules.
 */

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: HomePage,
        canActivate: [AuthGuard],
      },
      {
        path: 'monitor',
        loadChildren: 'app/monitor/MonitorModule#MonitorModule',
        canActivate: [AuthGuard],
      },
      {
        path: 'mdb',
        loadChildren: 'app/mdb/MdbModule#MdbModule',
        canActivate: [AuthGuard],
      },
      {
        path: 'system',
        loadChildren: 'app/system/SystemModule#SystemModule',
        canActivate: [AuthGuard],
      },
      {
        path: 'profile',
        component: ProfilePage,
        canActivate: [AuthGuard],
      },
      {
        path: 'login',
        component: LoginPage,
      },
      {
        path: '403',
        component: ForbiddenPage,
      },
      {
        path: '**',
        component: NotFoundPage,
      },
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'reload'  // See MonitorPage.ts for documentation
    }),
  ],
  exports: [ RouterModule ],
})
export class AppRoutingModule { }
