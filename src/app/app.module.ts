import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { NavTabsComponent } from './nav-tabs/nav-tabs.component';
import { SignupFormComponent } from './signup-form/signup-form.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { UsersComponent } from './users/users.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { NewCourseFormComponent } from './new-course-form/new-course-form.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { DummyPostsComponent } from './posts/posts.component';
import { PostsService } from './services/posts.service';
import { NotificationService } from './services/notification.service';
import { AppErrorHandler } from './common/app-error-handler';
import { AuthGuard } from './shared/auth.guard';
import { UserService } from './services/user.service';
import { AlertMessageComponent } from './common/components/alert-message/alert-message.component';
import { SanitizerUrlPipe } from './common/pipes/sanitize-url.pipe';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { FriendsCardComponent } from './common/components/friends-card/friends-card.component';
import { PostFormComponent } from './common/components/post-form/post-form.component';
import { ImageConatinerComponent } from './common/components/image-conatiner/image-conatiner.component';
import { PostsComponent } from './common/components/posts/posts.component';
import { CommonModule } from '@angular/common';
import { LikeComponent } from './common/components/like/like.component';
import { CommentFormComponent } from './common/components/comment-form/comment-form.component';
import { CommentsComponent } from './comments/comments.component';
import { ToggleCommentsComponent } from './common/components/toggle-comments/toggle-comments.component';
import { AuthService } from './shared/auth.service';
import { NGCComponent } from './ngc/ngc.component';
import { ClipboardModule } from 'ngx-clipboard';
import { ToastrModule } from 'ngx-toastr';
// import { QuillModule } from 'ngx-quill';

@NgModule({
  declarations: [
    AppComponent,
    ContactFormComponent,
    NavTabsComponent,
    SignupFormComponent,
    LoginFormComponent,
    NavbarComponent,
    HomeComponent,
    UsersComponent,
    NotfoundComponent,
    NewCourseFormComponent,
    ForgetPasswordComponent,
    PostsComponent,
    AlertMessageComponent,
    SanitizerUrlPipe,
    UserProfileComponent,
    FriendsCardComponent,
    PostFormComponent,
    DummyPostsComponent,
    ImageConatinerComponent,
    LikeComponent,
    CommentsComponent,
    CommentFormComponent,
    ToggleCommentsComponent,
    NGCComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ClipboardModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    // QuillModule,
  ],
  providers: [
    AuthService,
    NotificationService,
    UserService,
    PostsService,
    Validators,
    { provide: ErrorHandler, useClass: AppErrorHandler },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
