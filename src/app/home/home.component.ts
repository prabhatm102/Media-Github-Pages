import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { PostsService } from '../services/posts.service';
import { UserService } from '../services/user.service';
import { AuthService } from '../shared/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  imageUrl: string;
  currentUser: any;
  posts: any;

  constructor(
    private auth: AuthService,
    private postService: PostsService,
    private toastr: ToastrService
  ) {
    this.imageUrl = environment.imageUrl;
  }

  ngOnInit(): void {
    this.currentUser = this.auth.getDecodedAccessToken(
      localStorage.getItem('authToken') || ''
    );
    this.postService.getAll().subscribe((response) => {
      this.posts = response;
    });
  }
  addNewPost(event: Event) {
    this.posts.unshift(event);
    this.toastr.success('Successfully Posted!', '', {
      progressBar: true,
      closeButton: true,
      onActivateTick: false,
    });
  }
}
