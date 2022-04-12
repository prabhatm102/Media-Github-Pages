import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AlertMessageComponent } from './common/components/alert-message/alert-message.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { HomeComponent } from './home/home.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { NewCourseFormComponent } from './new-course-form/new-course-form.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { DummyPostsComponent } from './posts/posts.component';
import { UserService } from './services/user.service';
import { AuthGuard } from './shared/auth.guard';
import { PreventLoggedInGuard } from './shared/prevent-logged-in.guard';
import { SignupFormComponent } from './signup-form/signup-form.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  {
    path: 'test',
    // pathMatch: 'full',
    loadChildren: () => import('./test/ngc.module').then((m) => m.NgcModule),
  },
  {
    path: 'users',
    children: [
      { path: '', component: UsersComponent, canActivate: [AuthGuard] },
      {
        path: 'profile/:id',
        component: UserProfileComponent,
        resolve: {
          userData: UserService,
        },
        canActivate: [AuthGuard],
      },
      {
        path: 'signup',
        component: SignupFormComponent,
        canActivate: [PreventLoggedInGuard],
      },
      {
        path: 'login',
        component: LoginFormComponent,
        canActivate: [PreventLoggedInGuard],
      },
      {
        path: 'forget-password',
        component: ForgetPasswordComponent,
        canActivate: [PreventLoggedInGuard],
      },
    ],
  },

  { path: '', pathMatch: 'full', component: HomeComponent },
  // { path: 'test', component: NewCourseFormComponent, canActivate: [AuthGuard] },
  // { path: 'posts', component: DummyPostsComponent, canActivate: [AuthGuard] },
  { path: '**', component: NotfoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
