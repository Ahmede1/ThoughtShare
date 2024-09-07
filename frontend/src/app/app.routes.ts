import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { AuthGuard } from './auth.guard';
import { SearchResultsComponent } from './pages/search-results/search-results.component';
import { VideoPlayerComponent } from './pages/video-player/video-player.component';
import { GeneralTagRequestComponent } from './pages/general-tag-request/general-tag-request.component';
import { DataResolver } from './resolver/data.resolver';
import { PaymentPlansComponent } from './pages/payment-plans/payment-plans.component';

export const routes: Routes = [
  {
    path: '',
    title: "Home Page",
    component: HomePageComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'search',
    title: "Search Results",
    component: SearchResultsComponent,
    canActivate: [AuthGuard],
    resolve: { user: DataResolver } // Ensure user data is available for the tag request form page
  },
  {
    path: 'video',
    title: "Video Player",
    component: VideoPlayerComponent,
  },
  {
    path: 'tag-request-form',
    title: "General Tag Request",
    component: GeneralTagRequestComponent,
    canActivate: [AuthGuard],
    resolve: { user: DataResolver } // Ensure user data is available for the tag request form page
  },
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/dashboards/dashboard1',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/dashboard.routes').then(
            (m) => m.PagesRoutes
          ),
        canActivate: [AuthGuard],
        resolve: { user: DataResolver } // Ensure user data is available for the tag request form page

      },
      // {
      //   path: 'starter',
      //   loadChildren: () =>
      //     import('./pages/pages.routes').then((m) => m.PagesRoutes),
      // },
      // {
      //   // path: 'dashboards', 
      //   loadChildren: () =>
      //     import('./pages/dashboards/dashboards.routes').then(
      //       (m) => m.DashboardsRoutes
      //     ),
      // },
      {
        path: 'ui-components',
        loadChildren: () =>
          import('./pages/ui-components/ui-components.routes').then(
            (m) => m.UiComponentsRoutes
          ),
      },
      {
        path: 'forms',
        loadChildren: () =>
          import('./pages/forms/forms.routes').then((m) => m.FormsRoutes),
      },
      {
        path: 'charts',
        loadChildren: () =>
          import('./pages/charts/charts.routes').then((m) => m.ChartsRoutes),
      },
      {
        path: 'apps',
        loadChildren: () =>
          import('./pages/apps/apps.routes').then((m) => m.AppsRoutes),
      },
      {
        path: 'widgets',
        loadChildren: () =>
          import('./pages/widgets/widgets.routes').then((m) => m.WidgetsRoutes),
      },
      {
        path: 'tables',
        loadChildren: () =>
          import('./pages/tables/tables.routes').then((m) => m.TablesRoutes),
      },
      {
        path: 'datatable',
        loadChildren: () =>
          import('./pages/datatable/datatable.routes').then(
            (m) => m.DatatablesRoutes
          ),
      },
      {
        path: 'theme-pages',
        loadChildren: () =>
          import('./pages/theme-pages/theme-pages.routes').then(
            (m) => m.ThemePagesRoutes
          ),
      },
    ],
  },
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: 'authentication',
        loadChildren: () =>
          import('./pages/authentication/authentication.routes').then(
            (m) => m.AuthenticationRoutes
          ),
      },


      {
        path: 'landingpage',
        loadChildren: () =>
          import('./pages/theme-pages/landingpage/landingpage.routes').then(
            (m) => m.LandingPageRoutes
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'authentication/error',
  },
];
