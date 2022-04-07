import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { BadInput } from '../common/bad-input';
import { NotFoundError } from '../common/not-found-error';
import { UnauthorisedError } from '../common/unauthorised-error';
import { CommentService } from '../services/comment.service';
import { PostsService } from '../services/posts.service';

@Component({
  selector: 'comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css'],
})
export class CommentsComponent implements OnInit {
  @Input('user') user: any;
  @Input('post') post: any;
  imageUrl: string;
  comments: any = [];

  constructor(private service: CommentService, private toastr: ToastrService) {
    this.imageUrl = environment.imageUrl;
  }

  ngOnInit(): void {
    this.service.getById(this.post?._id).subscribe(
      (response) => {
        this.comments = response;
      },
      (error) => {
        this.handleError(error);
      }
    );
  }

  addNewComment(comment: any, el: HTMLElement) {
    this.comments.push(comment);
    el.scroll({
      top: el.scrollHeight,
      left: el.scrollWidth,
      behavior: 'smooth',
    });
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
