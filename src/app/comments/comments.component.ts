import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
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
  constructor(private service: CommentService) {
    this.imageUrl = environment.imageUrl;
  }

  ngOnInit(): void {
    this.service.getById(this.post?._id).subscribe((response) => {
      this.comments = response;
    });
  }

  addNewComment(comment: any) {
    this.comments.unshift(comment);
  }
}
