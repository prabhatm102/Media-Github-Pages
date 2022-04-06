import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PostsService } from 'src/app/services/posts.service';
import { environment } from 'src/environments/environment';
import { BadInput } from '../../bad-input';
import { NotFoundError } from '../../not-found-error';
import { UnauthorisedError } from '../../unauthorised-error';
// import { EventEmitter } from 'stream';

@Component({
  selector: 'post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css'],
})
export class PostFormComponent implements OnInit {
  @Output('newPostEvent') newPostEvent = new EventEmitter();
  @Input('user') user: any;
  form: any;
  localPostImageUrl: string = '';

  constructor(
    private fb: FormBuilder,
    private service: PostsService,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      message: fb.control('', []),
      postFile: fb.control('', []),
      fileSource: fb.control('', []),
    });
  }

  get message() {
    return this.form.get('message');
  }

  get postFile() {
    return this.form.get('postFile');
  }

  ngOnInit(): void {}

  post() {
    if (
      !this.form.valid ||
      (!this.form.get('message').value && !this.form.get('fileSource').value) ||
      !this.user?._id
    )
      return;

    let formData = new FormData();
    if (this.form.get('message').value)
      formData.append('message', this.form.get('message').value);

    if (this.form.get('fileSource').value) {
      formData.append('postFile', this.form.get('fileSource').value);
    }

    this.service.createById(this?.user?._id, formData).subscribe(
      (response) => {
        this.newPostEvent.emit(response);
        this.form.reset();
        this.localPostImageUrl = '';
      },
      (error) => {
        this.form.reset();
        this.localPostImageUrl = '';
        this.handleError(error);
      }
    );
  }

  // updateImageUrl(url: any) {
  //   this.localPostImageUrl = url;
  // }

  onFileSelect(event: any) {
    let allowedExtensions = ['image/jpeg', 'image/png'];

    if (event.target.files.length > 0) {
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

  handleError(error: any) {
    if (
      error instanceof UnauthorisedError ||
      error instanceof BadInput ||
      error instanceof NotFoundError
    )
      this.toastr.error(
        error?.originalError?.error?.message || 'Not Found',
        error?.originalError?.status,
        {
          progressBar: true,
          closeButton: true,
          timeOut: 800,
        }
      );
    else
      this.toastr.error('Something went wrong!', '500', {
        progressBar: true,
        closeButton: true,
        timeOut: 800,
      });
  }
}
