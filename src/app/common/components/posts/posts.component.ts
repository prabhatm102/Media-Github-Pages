import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PostsService } from 'src/app/services/posts.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
})
export class PostsComponent implements OnInit {
  @Input('posts') posts: any;
  @Input('user') user: any;
  @Input('currentUser') currentUser: any;
  form: any;
  selectedPost: any;
  likedBy: any;
  localPostImageUrl: string = '';
  selectedPostImageUrl: string = '';

  // posts: any = [];
  imageUrl: string;
  postImageUrl: string;
  constructor(
    private service: PostsService,
    fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.imageUrl = environment.imageUrl;
    this.postImageUrl = environment.postImageUrl;
    this.selectedPostImageUrl = environment.postImageUrl;

    this.form = fb.group({
      message: fb.control('', [Validators.required]),
      postFile: fb.control(''),
      fileSource: fb.control(''),
    });
  }

  get message() {
    return this.form.get('message');
  }

  get postFile() {
    return this.form.get('postFile');
  }

  ngOnInit(): void {
    // this.service.getById(this.user?._id).subscribe((response) => {
    //   this.posts = response;
    // });
  }

  deletePost(post: any) {
    Swal.fire({
      title: 'Are you sure want to delete?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.value) {
        this.service.delete(post._id).subscribe(
          (response) => {
            let index = this.posts.findIndex((p: any) => p._id === post._id);
            this.posts.splice(index, 1);

            this.toastr.success('Post successfully deleted', '', {
              progressBar: true,
              closeButton: true,
              onActivateTick: false,
            });
          },
          (error: Response) => {}
        );
      }
    });
  }

  isLiked(likes: any): boolean {
    if (likes?.find((u: any) => u?._id === this.currentUser?._id)) return true;
    else return false;
  }
  toggleComments(post: any) {
    let index = this.posts.findIndex((p: any) => p._id === post._id);
    if (index !== -1) this.posts[index] = post;
  }

  toggleLikePost(isLiked: any, post: any) {
    this.service.likePost(post._id).subscribe((response) => {
      let index = this.posts.findIndex((p: any) => p._id === post._id);
      if (index !== -1) {
        this.posts[index].likes = JSON.parse(JSON.stringify(response))?.likes;
      }
    });
  }

  toggleLikedBy(post: any) {
    this.likedBy = post.likes;
  }
  selectPost(post: any) {
    this.selectedPost = post;

    this.form.controls['message'].value = post?.message;
    this.form.controls['postFile'].value = post?.postFile;
    this.form.controls['fileSource'].value = '';

    this.form.controls['message'].setErrors();
    this.form.controls['postFile'].setErrors();
    this.form.controls['fileSource'].setErrors();
  }
  onFileSelect(event: any) {
    let allowedExtensions = ['image/jpeg', 'image/png'];

    if (event.target.files.length > 0) {
      this.form.controls['postFile'].touched = true;
      const file = event.target.files[0];
      if (!allowedExtensions.includes(file.type)) {
        event.target.value = '';
        this.localPostImageUrl = '';
        return this.form.controls['postFile'].setErrors({
          invalidFileExtension: true,
        });
      }
      this.form.patchValue({ fileSource: file });
      this.localPostImageUrl = URL.createObjectURL(event.target.files[0]);
      this.form.controls['postFile'].touched = true;
    }
  }
  updatePostImageUrl(url: string) {
    this.localPostImageUrl = url;
    this.selectedPost = '';
  }

  updatePost() {
    if (!this.form.valid) return;

    let formData = new FormData();
    formData.append('message', this.form.get('message').value);

    if (this.form.get('fileSource').value)
      formData.append('postFile', this.form.get('fileSource').value);

    let newData = {
      name: this.form.get('message').value,
      postFile: this.form.get('postFile').value,
    };

    let prevdata = {
      name: this.selectedPost?.message,
      postFile: this.selectedPost?.postFile,
    };

    if (JSON.stringify(newData) === JSON.stringify(prevdata)) return;

    this.service
      .update(this.selectedPost?._id, formData)
      .subscribe((response) => {
        let index = this.posts.findIndex(
          (u: any) => u._id === this.selectedPost._id
        );
        this.posts[index] = response.body;
        this.form.reset();
        this.selectedPost = '';
        this.toastr.success('Post successfully updated', '', {
          progressBar: true,
          closeButton: true,
          onActivateTick: false,
        });
      });
  }

  copied() {
    this.toastr.success('copied to clipboard', '', {
      timeOut: 500,
      progressBar: true,
      closeButton: true,
      onActivateTick: false,
    });
  }
}
