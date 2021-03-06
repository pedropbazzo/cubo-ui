import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
  PageAvatarExampleComponent,
  PageAvatarApiComponent,
  PageAvatarComponent
} from './page-avatar.component';

export const PageAvatarRoutes: Routes = [
  {
    path: '',
    component: PageAvatarExampleComponent,
    outlet: 'example'
  },
  {
    path: '',
    component: PageAvatarApiComponent,
    outlet: 'api'
  },
  {
    path: '',
    component: PageAvatarComponent,
  }
];
@NgModule({
  imports: [RouterModule.forChild(PageAvatarRoutes)],
  exports: [RouterModule]
})
export class PageAvatarRouting { }
