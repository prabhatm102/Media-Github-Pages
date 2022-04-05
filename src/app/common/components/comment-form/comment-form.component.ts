import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CommentService } from 'src/app/services/comment.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.css'],
})
export class CommentFormComponent implements OnInit {
  form: any;
  @Input('user') user: any;
  @Input('post') post: any;
  @Output('newCommentEvent') newCommentEvent = new EventEmitter();
  imageUrl: string;

  constructor(fb: FormBuilder, private service: CommentService) {
    this.imageUrl = environment.imageUrl;
    this.form = fb.group({
      comment: fb.control('', [Validators.required]),
    });
  }

  ngOnInit(): void {}

  comment() {
    if (!this.form.valid) return;

    this.service
      .create({
        comment: this.form.get('comment').value,
        userId: this.user?._id,
        postId: this.post?._id,
      })
      .subscribe((response) => {
        let post = JSON.stringify(response);
        this.form.reset();
        this.newCommentEvent.emit(
          JSON.parse(post)?.comments[JSON.parse(post)?.comments?.length - 1]
        );
      });
  }
}
