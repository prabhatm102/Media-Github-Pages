import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { PostsService } from '../services/posts.service';
import { UserService } from '../services/user.service';
import { AuthService } from '../shared/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  user: any;
  imageUrl: string;
  currentUser: any;
  posts: any;

  constructor(
    private route: ActivatedRoute,
    private service: UserService,
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

    this.route.paramMap.subscribe((params) => {
      let id = params.get('id');
      this.service.getById(id).subscribe((response) => {
        this.user = response;

        let friend = this.user?.friends.find(
          (f: any) => f?.user?._id === this.currentUser?._id
        );

        if (this.currentUser) {
          if (friend && friend.status) {
            if (friend.status === 'pending') {
              this.user.status = 'Cancel Request';
            } else if (friend.status === 'sent') {
              this.user.status = 'sent';
            } else if (friend.status === 'requested') {
              this.user.status = 'Cancel Request';
            } else if (friend.status === 'success') {
              this.user.status = 'Remove Friend';
            }
          } else {
            this.user.status = 'Send Request';
          }
        }
      });

      this.postService.getByUserId(id).subscribe((response) => {
        this.posts = response;
      });
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
