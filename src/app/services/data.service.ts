import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppError } from '../common/app-error';
import { BadInput } from '../common/bad-input';
import { NotFoundError } from '../common/not-found-error';
import { AuthService } from '../shared/auth.service';
import { AlreadyExistsError } from '../common/already-exists-error';

// @Injectable({
//   providedIn: 'root'
// })
export class DataService {
  //   private url="https://jsonplaceholder.typicode.com/posts";

  constructor(
    private url: string,
    private http: HttpClient,
    private authService?: AuthService
  ) {}

  getAll() {
    return this.http
      .get(this.url, {
        headers: {
          ['x-auth-token']: localStorage.getItem('authToken') || '',
        },
      })
      .pipe(catchError((error: Response) => this.handleError(error)));
  }

  getById(id: any) {
    return this.http
      .get(this.url + '/' + id, {
        headers: {
          ['x-auth-token']: localStorage.getItem('authToken') || '',
        },
      })
      .pipe(catchError((error: Response) => this.handleError(error)));
  }

  getByUserId(id: any) {
    return this.http
      .get(this.url + '/user/' + id, {
        headers: { ['x-auth-token']: localStorage.getItem('authToken') || '' },
      })
      .pipe(catchError((error: Response) => this.handleError(error)));
  }

  create(resource: any) {
    return this.http
      .post(this.url, resource, {
        headers: { ['x-auth-token']: localStorage.getItem('authToken') || '' },
      })
      .pipe(catchError((error: Response) => this.handleError(error)));
  }
  createById(id: any, resource: any) {
    return this.http
      .post(this.url + '/' + id, resource, {
        headers: { ['x-auth-token']: localStorage.getItem('authToken') || '' },
      })
      .pipe(catchError((error: Response) => this.handleError(error)));
  }

  likePost(postId: string) {
    return this.http
      .post(
        this.url + '/toggleLike',
        { post: postId },
        {
          headers: {
            ['x-auth-token']: localStorage.getItem('authToken') || '',
          },
        }
      )
      .pipe(catchError((error: Response) => this.handleError(error)));
  }

  updatePatch(resource: any) {
    return this.http
      .patch(
        this.url + '/' + resource.id,
        { isRead: resource.isRead },
        {
          headers: {
            ['x-auth-token']: localStorage.getItem('authToken') || '',
          },
        }
      )
      .pipe(catchError((error: Response) => this.handleError(error)));
  }

  update(id: any, resource: any) {
    return this.http
      .put(this.url + '/' + id, resource, {
        headers: { ['x-auth-token']: localStorage.getItem('authToken') || '' },
        observe: 'response',
      })
      .pipe(catchError((error: Response) => this.handleError(error)));
  }

  delete(id: any) {
    return this.http
      .delete(this.url + '/' + id, {
        headers: { ['x-auth-token']: localStorage.getItem('authToken') || '' },
      })
      .pipe(catchError((error: Response) => this.handleError(error)));
  }

  private handleError(error: Response) {
    if (error.status === 404) return throwError(new NotFoundError(error));
    if (error.status === 400) return throwError(new BadInput(error));
    if (error.status === 409) return throwError(new AlreadyExistsError(error));

    return throwError(new AppError(error));
  }
}
