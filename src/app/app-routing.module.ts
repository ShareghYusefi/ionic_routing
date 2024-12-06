import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '', loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  }
  // {
  //   path: 'home',
  //   // Lazy-loading modules: This is done so that the home page is loaded only when the user navigates to it.
  //   loadChildren: () =>
  //     import('./home/home.module').then((m) => m.HomePageModule),
  // },
  // {
  //   path: '',
  //   redirectTo: 'home',
  //   pathMatch: 'full',
  // },
  // {
  //   path: 'about',
  //   loadChildren: () =>
  //     import('./about/about.module').then((m) => m.AboutPageModule),
  // },
  // {
  //   path: 'contact/:id',
  //   loadChildren: () =>
  //     import('./contact/contact.module').then((m) => m.ContactPageModule),
  // },
  // {
  //   path: 'contact',
  //   loadChildren: () =>
  //     import('./contact/contact.module').then((m) => m.ContactPageModule),
  // },
  // {
  //   path: 'tabs',
  //   loadChildren: () => import('./tabs/tabs.module').then( m => m.TabsPageModule)
  // },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
